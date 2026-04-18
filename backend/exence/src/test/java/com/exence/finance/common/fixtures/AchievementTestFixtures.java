package com.exence.finance.common.fixtures;

import com.exence.finance.modules.achievement.dto.AchievementGetDTO;
import com.exence.finance.modules.achievement.dto.WorkspaceAchievementGetDTO;
import com.exence.finance.modules.achievement.entity.Achievement;
import com.exence.finance.modules.achievement.enums.AchievementTier;
import com.exence.finance.modules.achievement.enums.AchievementType;
import java.time.Instant;

public final class AchievementTestFixtures {

    private AchievementTestFixtures() {}

    public static Achievement goldInvestmentAchievement() {
        return Achievement.builder()
                .id(1L)
                .name("Investment_Master")
                .description("Achieve_10_Investments")
                .tier(AchievementTier.GOLD)
                .type(AchievementType.GOAL_COUNT)
                .requirementValue(10L)
                .build();
    }

    public static Achievement bronzeTransactionAchievement() {
        return Achievement.builder()
                .id(2L)
                .name("First_Transaction")
                .description("Complete_Your_First_Transaction")
                .tier(AchievementTier.BRONZE)
                .type(AchievementType.TRANSACTION_COUNT)
                .requirementValue(1L)
                .build();
    }

    public static Achievement silverDebtAchievement() {
        return Achievement.builder()
                .id(3L)
                .name("Debt_Tracker")
                .description("Add_5_Debts")
                .tier(AchievementTier.SILVER)
                .type(AchievementType.DEBT_COUNT)
                .requirementValue(5L)
                .build();
    }

    public static AchievementGetDTO unlockedAchievementDTO() {
        return new AchievementGetDTO(
                1L,
                "Investment_Master",
                "Achieve_10_Investments",
                AchievementTier.GOLD,
                AchievementType.GOAL_COUNT,
                10L,
                10L,
                true,
                Instant.parse("2026-01-15T10:00:00Z"));
    }

    public static AchievementGetDTO lockedAchievementDTO() {
        return new AchievementGetDTO(
                2L,
                "First_Transaction",
                "Complete_Your_First_Transaction",
                AchievementTier.BRONZE,
                AchievementType.TRANSACTION_COUNT,
                1L,
                0L,
                false,
                null);
    }

    public static AchievementGetDTO partialProgressAchievementDTO() {
        return new AchievementGetDTO(
                3L,
                "Debt_Tracker",
                "Add_5_Debts",
                AchievementTier.SILVER,
                AchievementType.DEBT_COUNT,
                5L,
                3L,
                false,
                null);
    }

    public static WorkspaceAchievementGetDTO workspaceAchievementDTO() {
        return new WorkspaceAchievementGetDTO(
                1L,
                1L,
                "Investment_Master",
                "Achieve_10_Investments",
                AchievementTier.GOLD,
                AchievementType.GOAL_COUNT,
                10L,
                Instant.parse("2026-01-15T10:00:00Z"));
    }
}
