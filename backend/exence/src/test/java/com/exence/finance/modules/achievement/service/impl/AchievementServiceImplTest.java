package com.exence.finance.modules.achievement.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.fixtures.AchievementTestFixtures;
import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.achievement.checker.AchievementChecker;
import com.exence.finance.modules.achievement.dto.AchievementGetDTO;
import com.exence.finance.modules.achievement.dto.WorkspaceAchievementGetDTO;
import com.exence.finance.modules.achievement.entity.Achievement;
import com.exence.finance.modules.achievement.entity.AchievementProgress;
import com.exence.finance.modules.achievement.entity.WorkspaceAchievement;
import com.exence.finance.modules.achievement.enums.AchievementTier;
import com.exence.finance.modules.achievement.enums.AchievementType;
import com.exence.finance.modules.achievement.repository.AchievementProgressRepository;
import com.exence.finance.modules.achievement.repository.AchievementRepository;
import com.exence.finance.modules.achievement.repository.WorkspaceAchievementRepository;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.repository.WorkspaceRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AchievementServiceImplTest {

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private AchievementRepository achievementRepository;

    @Mock
    private WorkspaceAchievementRepository workspaceAchievementRepository;

    @Mock
    private AchievementProgressRepository achievementProgressRepository;

    @Mock
    private List<AchievementChecker> checkers;

    @Mock
    private I18nService i18nService;

    @InjectMocks
    private AchievementServiceImpl achievementService;

    private static final Long WORKSPACE_ID = 1L;

    @BeforeEach
    void setUp() {
        WorkspaceContextHolder.setWorkspaceId(WORKSPACE_ID);
    }

    @Test
    @DisplayName("returns all achievements with progress and unlock status")
    void getAllAchievements() {
        // given
        Achievement goldAchievement = AchievementTestFixtures.goldInvestmentAchievement();
        Achievement bronzeAchievement = AchievementTestFixtures.bronzeTransactionAchievement();

        WorkspaceAchievement unlockedGold = WorkspaceAchievement.builder()
                .id(1L)
                .achievement(goldAchievement)
                .unlockedAt(Instant.parse("2026-01-15T10:00:00Z"))
                .build();

        given(achievementRepository.findAll()).willReturn(List.of(goldAchievement, bronzeAchievement));
        given(workspaceAchievementRepository.findByWorkspaceId(WORKSPACE_ID)).willReturn(List.of(unlockedGold));
        given(achievementProgressRepository.findAllByWorkspaceId(WORKSPACE_ID)).willReturn(List.of());
        given(i18nService.get("Investment_Master")).willReturn("Investment Master");
        given(i18nService.get("Achieve_10_Investments")).willReturn("Achieve 10 Investments");
        given(i18nService.get("First_Transaction")).willReturn("First Transaction");
        given(i18nService.get("Complete_Your_First_Transaction")).willReturn("Complete Your First Transaction");

        // when
        List<AchievementGetDTO> result = achievementService.getAllAchievements();

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).unlocked()).isTrue();
        assertThat(result.get(0).unlockedAt()).isEqualTo(Instant.parse("2026-01-15T10:00:00Z"));
        assertThat(result.get(1).unlocked()).isFalse();
        assertThat(result.get(1).unlockedAt()).isNull();
    }

    @Test
    @DisplayName("returns only unlocked achievements for workspace")
    void getUnlockedAchievements() {
        // given
        Achievement goldAchievement = AchievementTestFixtures.goldInvestmentAchievement();
        WorkspaceAchievement unlockedAchievement = WorkspaceAchievement.builder()
                .id(1L)
                .achievement(goldAchievement)
                .unlockedAt(Instant.parse("2026-01-15T10:00:00Z"))
                .build();

        given(workspaceAchievementRepository.findByWorkspaceId(WORKSPACE_ID)).willReturn(List.of(unlockedAchievement));
        given(i18nService.get("Investment_Master")).willReturn("Investment Master");
        given(i18nService.get("Achieve_10_Investments")).willReturn("Achieve 10 Investments");

        // when
        List<WorkspaceAchievementGetDTO> result = achievementService.getUnlockedAchievements();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.getFirst().achievementId()).isEqualTo(1L);
        assertThat(result.getFirst().tier()).isEqualTo(AchievementTier.GOLD);
    }

    @Test
    @DisplayName("skips processing when workspace already has GOLD tier for type")
    void processAchievement_alreadyGold() {
        // given
        given(workspaceAchievementRepository.existsByWorkspaceIdAndTypeAndTier(
                        WORKSPACE_ID, AchievementType.GOAL_COUNT, AchievementTier.GOLD))
                .willReturn(true);

        // when
        achievementService.processAchievement(WORKSPACE_ID, AchievementType.GOAL_COUNT);

        // then
        then(achievementProgressRepository).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("saves progress and unlocks qualified achievements")
    void processAchievement_unlocksAchievements() {
        // given
        Long currentValue = 5L;
        AchievementChecker checker = MockAchievementChecker.of(AchievementType.GOAL_COUNT, currentValue);
        Achievement silverAchievement = AchievementTestFixtures.silverDebtAchievement();
        silverAchievement.setType(AchievementType.GOAL_COUNT);
        silverAchievement.setRequirementValue(3L);

        Workspace workspace = Workspace.builder().id(WORKSPACE_ID).build();
        AchievementProgress progress = AchievementProgress.builder()
                .workspace(workspace)
                .achievementType(AchievementType.GOAL_COUNT)
                .currentValue(0L)
                .build();

        given(workspaceAchievementRepository.existsByWorkspaceIdAndTypeAndTier(
                        WORKSPACE_ID, AchievementType.GOAL_COUNT, AchievementTier.GOLD))
                .willReturn(false);
        given(checkers.stream()).willAnswer(inv -> List.of(checker).stream());
        given(achievementProgressRepository.findByWorkspaceIdAndType(WORKSPACE_ID, AchievementType.GOAL_COUNT))
                .willReturn(Optional.of(progress));
        given(workspaceRepository.getReferenceById(WORKSPACE_ID)).willReturn(workspace);
        given(workspaceAchievementRepository.findUnlockedAchievementIdsByWorkspaceId(WORKSPACE_ID))
                .willReturn(java.util.Set.of());
        given(achievementRepository.findQualifiedByType(AchievementType.GOAL_COUNT, currentValue))
                .willReturn(List.of(silverAchievement));

        // when
        achievementService.processAchievement(WORKSPACE_ID, AchievementType.GOAL_COUNT);

        // then
        then(achievementProgressRepository).should().save(any(AchievementProgress.class));
        then(workspaceAchievementRepository).should().save(any(WorkspaceAchievement.class));
    }

    // Helper mock checker for testing
    static class MockAchievementChecker implements AchievementChecker {
        private final AchievementType type;
        private final Long value;

        MockAchievementChecker(AchievementType type, Long value) {
            this.type = type;
            this.value = value;
        }

        static MockAchievementChecker of(AchievementType type, Long value) {
            return new MockAchievementChecker(type, value);
        }

        @Override
        public AchievementType getSupportedType() {
            return type;
        }

        @Override
        public long computeCurrentValue(Long workspaceId) {
            return value;
        }
    }
}
