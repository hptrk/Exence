package com.exence.finance.modules.statistics.dto;

import java.time.Instant;
import java.util.Map;

public record WidgetRequest(
        Instant startDate, Instant endDate, Timeframe timeframe, Map<WidgetSetting, Object> settings) {}
