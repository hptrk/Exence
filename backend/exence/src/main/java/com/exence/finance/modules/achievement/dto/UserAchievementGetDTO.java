package com.exence.finance.modules.achievement.dto;

import com.exence.finance.modules.achievement.enums.AchievementTier;
import com.exence.finance.modules.achievement.enums.AchievementType;
import java.time.Instant;

public record UserAchievementGetDTO(
        Long id,
        Long achievementId,
        String name,
        String description,
        AchievementTier tier,
        AchievementType type,
        Long requirementValue,
        Instant unlockedAt) {}
