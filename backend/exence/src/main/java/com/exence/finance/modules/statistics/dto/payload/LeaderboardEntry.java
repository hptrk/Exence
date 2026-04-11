package com.exence.finance.modules.statistics.dto.payload;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Leaderboard Entry DTO", description = "Represents a single entry in the user leaderboard.")
public record LeaderboardEntry(
        @Schema(description = "The rank of the user in the leaderboard", example = "1") int rank,
        @Schema(description = "The username of the user", example = "Winston") String username,
        @Schema(description = "The value that determines the user's position in the leaderboard.", example = "500")
                long value) {}
