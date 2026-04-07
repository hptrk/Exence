package com.exence.finance.modules.achievement.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.achievement.checker.AchievementChecker;
import com.exence.finance.modules.achievement.dto.AchievementGetDTO;
import com.exence.finance.modules.achievement.dto.UserAchievementGetDTO;
import com.exence.finance.modules.achievement.dto.projection.ProgressProjection;
import com.exence.finance.modules.achievement.entity.Achievement;
import com.exence.finance.modules.achievement.entity.AchievementProgress;
import com.exence.finance.modules.achievement.entity.UserAchievement;
import com.exence.finance.modules.achievement.enums.AchievementTier;
import com.exence.finance.modules.achievement.enums.AchievementType;
import com.exence.finance.modules.achievement.repository.AchievementProgressRepository;
import com.exence.finance.modules.achievement.repository.AchievementRepository;
import com.exence.finance.modules.achievement.repository.UserAchievementRepository;
import com.exence.finance.modules.achievement.service.AchievementService;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.UserService;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AchievementServiceImpl implements AchievementService {

    private final UserService userService;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final AchievementProgressRepository achievementProgressRepository;
    private final UserRepository userRepository;
    private final List<AchievementChecker> checkers;
    private final I18nService i18n;

    @ReadTransactional
    public List<AchievementGetDTO> getAllAchievements() {
        Long userId = userService.getCurrentUserId();
        List<Achievement> achievements = achievementRepository.findAll();

        Map<Long, UserAchievement> unlockedMap = userAchievementRepository.findByUserId(userId).stream()
                .collect(Collectors.toMap(ua -> ua.getAchievement().getId(), ua -> ua));

        Map<AchievementType, Long> progressMap = achievementProgressRepository.findAllByUserId(userId).stream()
                .collect(Collectors.toMap(ProgressProjection::type, ProgressProjection::currentValue));

        return achievements.stream()
                .map(a -> {
                    boolean unlocked = unlockedMap.containsKey(a.getId());
                    UserAchievement ua = unlockedMap.get(a.getId());
                    long progress = progressMap.getOrDefault(a.getType(), 0L);
                    return new AchievementGetDTO(
                            a.getId(),
                            i18n.get(a.getName()),
                            i18n.get(a.getDescription()),
                            a.getTier(),
                            a.getType(),
                            a.getRequirementValue(),
                            Math.min(progress, a.getRequirementValue()),
                            unlocked,
                            ua != null ? ua.getUnlockedAt() : null);
                })
                .toList();
    }

    @ReadTransactional
    public List<UserAchievementGetDTO> getUnlockedAchievements() {
        Long userId = userService.getCurrentUserId();
        return userAchievementRepository.findByUserId(userId).stream()
                .map(ua -> new UserAchievementGetDTO(
                        ua.getId(),
                        ua.getAchievement().getId(),
                        i18n.get(ua.getAchievement().getName()),
                        i18n.get(ua.getAchievement().getDescription()),
                        ua.getAchievement().getTier(),
                        ua.getAchievement().getType(),
                        ua.getAchievement().getRequirementValue(),
                        ua.getUnlockedAt()))
                .toList();
    }

    @WriteTransactional
    public void processAchievement(Long userId, AchievementType type) {
        if (userAchievementRepository.existsByUserIdAndTypeAndTier(userId, type, AchievementTier.GOLD)) {
            log.debug("Skipping achievement processing, user (userId={}) already has GOLD for type={}", userId, type);
            return;
        }

        // get relevant checker
        AchievementChecker checker = checkers.stream()
                .filter(c -> c.getSupportedType() == type)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No checker found for type: " + type));

        long currentValue = checker.computeCurrentValue(userId);

        User userRef = userRepository.getReferenceById(userId);

        // upsert
        AchievementProgress progress = achievementProgressRepository
                .findByUserIdAndType(userId, type)
                .orElseGet(() -> AchievementProgress.builder()
                        .user(userRef)
                        .achievementType(type)
                        .currentValue(0L)
                        .build());
        progress.setCurrentValue(currentValue);
        achievementProgressRepository.save(progress);

        Set<Long> alreadyUnlocked = userAchievementRepository.findUnlockedAchievementIdsByUserId(userId);

        List<Achievement> qualified = achievementRepository.findQualifiedByType(type, currentValue);
        for (Achievement achievement : qualified) {
            if (!alreadyUnlocked.contains(achievement.getId())) {
                UserAchievement ua = UserAchievement.builder()
                        .user(userRef)
                        .achievement(achievement)
                        .build();
                userAchievementRepository.save(ua);
                log.info(
                        "Achievement unlocked: userId={}, achievement={} ({})",
                        userId,
                        achievement.getName(),
                        achievement.getTier());
            }
        }
    }
}
