package com.exence.finance.modules.achievement.dto;

import com.exence.finance.modules.achievement.enums.AchievementTier;
import com.exence.finance.modules.achievement.enums.AchievementType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(title = "Achievement Get DTO", description = "Used for retrieving achievement details.")
public record AchievementGetDTO(
        @Schema(description = "Unique identifier of the achievement", example = "1") Long id,
        @Schema(description = "Name of the achievement", example = "First Investment") String name,
        @Schema(description = "Detailed description of the achievement", example = "Complete your first investment")
                String description,
        @Schema(description = "Tier of the achievement", example = "BRONZE") AchievementTier tier,
        @Schema(description = "Type of the achievement", example = "INVESTMENT") AchievementType type,
        @Schema(description = "Value required to unlock the achievement", example = "1000") Long requirementValue,
        @Schema(description = "Current progress towards unlocking the achievement", example = "500")
                Long currentProgress,
        @Schema(description = "Indicates whether the achievement is unlocked", example = "true") boolean unlocked,
        @Schema(description = "Timestamp when the achievement was unlocked", example = "2026-06-01T12:00:00Z")
                Instant unlockedAt) {}
