package com.exence.finance.modules.statistics.dto.payload;

import java.util.List;

public record LeaderboardPayload(List<LeaderboardEntry> entries) implements WidgetDataPayload {}
