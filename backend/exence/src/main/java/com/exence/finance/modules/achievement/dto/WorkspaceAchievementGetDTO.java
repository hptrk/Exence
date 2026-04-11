package com.exence.finance.modules.achievement.dto;

import com.exence.finance.modules.achievement.enums.AchievementTier;
import com.exence.finance.modules.achievement.enums.AchievementType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(title = "Workspace Achievement Get DTO", description = "Used for retrieving workspace achievement details.")
public record WorkspaceAchievementGetDTO(
        @Schema(description = "Unique identifier of the workspace's achievement", example = "1") Long id,
        @Schema(description = "Unique identifier of the achievement", example = "1") Long achievementId,
        @Schema(description = "Name of the achievement", example = "First Investment") String name,
        @Schema(description = "Detailed description of the achievement", example = "Complete your first investment")
                String description,
        @Schema(description = "Tier of the achievement", example = "BRONZE") AchievementTier tier,
        @Schema(description = "Type of the achievement", example = "INVESTMENT") AchievementType type,
        @Schema(description = "Value required to unlock the achievement", example = "1000") Long requirementValue,
        @Schema(description = "The time when the achievement was unlocked in the workspace", example = "2025-06-01T12:00:00Z")
                Instant unlockedAt) {}
