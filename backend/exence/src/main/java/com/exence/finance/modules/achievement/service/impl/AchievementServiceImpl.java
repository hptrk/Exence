package com.exence.finance.modules.achievement.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.achievement.checker.AchievementChecker;
import com.exence.finance.modules.achievement.dto.AchievementGetDTO;
import com.exence.finance.modules.achievement.dto.WorkspaceAchievementGetDTO;
import com.exence.finance.modules.achievement.dto.projection.ProgressProjection;
import com.exence.finance.modules.achievement.entity.Achievement;
import com.exence.finance.modules.achievement.entity.AchievementProgress;
import com.exence.finance.modules.achievement.entity.WorkspaceAchievement;
import com.exence.finance.modules.achievement.enums.AchievementTier;
import com.exence.finance.modules.achievement.enums.AchievementType;
import com.exence.finance.modules.achievement.repository.AchievementProgressRepository;
import com.exence.finance.modules.achievement.repository.AchievementRepository;
import com.exence.finance.modules.achievement.repository.WorkspaceAchievementRepository;
import com.exence.finance.modules.achievement.service.AchievementService;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.repository.WorkspaceRepository;
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

    private final WorkspaceRepository workspaceRepository;
    private final AchievementRepository achievementRepository;
    private final WorkspaceAchievementRepository workspaceAchievementRepository;
    private final AchievementProgressRepository achievementProgressRepository;
    private final List<AchievementChecker> checkers;
    private final I18nService i18n;

    @ReadTransactional
    public List<AchievementGetDTO> getAllAchievements() {
        Long workspaceId = WorkspaceContextHolder.getWorkspaceId();
        List<Achievement> achievements = achievementRepository.findAll();

        Map<Long, WorkspaceAchievement> unlockedMap =
                workspaceAchievementRepository.findByWorkspaceId(workspaceId).stream()
                        .collect(Collectors.toMap(wa -> wa.getAchievement().getId(), wa -> wa));

        Map<AchievementType, Long> progressMap =
                achievementProgressRepository.findAllByWorkspaceId(workspaceId).stream()
                        .collect(Collectors.toMap(ProgressProjection::type, ProgressProjection::currentValue));

        return achievements.stream()
                .map(a -> {
                    boolean unlocked = unlockedMap.containsKey(a.getId());
                    WorkspaceAchievement wa = unlockedMap.get(a.getId());
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
                            wa != null ? wa.getUnlockedAt() : null);
                })
                .toList();
    }

    @ReadTransactional
    public List<WorkspaceAchievementGetDTO> getUnlockedAchievements() {
        Long workspaceId = WorkspaceContextHolder.getWorkspaceId();
        return workspaceAchievementRepository.findByWorkspaceId(workspaceId).stream()
                .map(wa -> new WorkspaceAchievementGetDTO(
                        wa.getId(),
                        wa.getAchievement().getId(),
                        i18n.get(wa.getAchievement().getName()),
                        i18n.get(wa.getAchievement().getDescription()),
                        wa.getAchievement().getTier(),
                        wa.getAchievement().getType(),
                        wa.getAchievement().getRequirementValue(),
                        wa.getUnlockedAt()))
                .toList();
    }

    @WriteTransactional
    public void processAchievement(Long workspaceId, AchievementType type) {
        if (workspaceAchievementRepository.existsByWorkspaceIdAndTypeAndTier(workspaceId, type, AchievementTier.GOLD)) {
            log.debug(
                    "Skipping achievement processing, workspace (workspaceId={}) already has GOLD for type={}",
                    workspaceId,
                    type);
            return;
        }

        AchievementChecker checker = checkers.stream()
                .filter(c -> c.getSupportedType() == type)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No checker found for type: " + type));

        long currentValue = checker.computeCurrentValue(workspaceId);

        Workspace workspaceRef = workspaceRepository.getReferenceById(workspaceId);

        AchievementProgress progress = achievementProgressRepository
                .findByWorkspaceIdAndType(workspaceId, type)
                .orElseGet(() -> AchievementProgress.builder()
                        .workspace(workspaceRef)
                        .achievementType(type)
                        .currentValue(0L)
                        .build());
        progress.setCurrentValue(currentValue);
        achievementProgressRepository.save(progress);

        Set<Long> alreadyUnlocked = workspaceAchievementRepository.findUnlockedAchievementIdsByWorkspaceId(workspaceId);

        List<Achievement> qualified = achievementRepository.findQualifiedByType(type, currentValue);
        for (Achievement achievement : qualified) {
            if (!alreadyUnlocked.contains(achievement.getId())) {
                WorkspaceAchievement wa = WorkspaceAchievement.builder()
                        .workspace(workspaceRef)
                        .achievement(achievement)
                        .build();
                workspaceAchievementRepository.save(wa);
                log.info(
                        "Achievement unlocked: workspaceId={}, achievement={} ({})",
                        workspaceId,
                        achievement.getName(),
                        achievement.getTier());
            }
        }
    }
}
