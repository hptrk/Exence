package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(title = "Leaderboard Payload DTO", description = "Payload for leaderboard widgets.")
public record LeaderboardPayload(WidgetType type, List<LeaderboardEntry> entries) implements WidgetDataPayload {}
