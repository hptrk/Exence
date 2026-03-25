package com.exence.finance.modules.statistics.dto;

import java.time.Instant;
import java.util.Map;

public record WidgetRequest(
        Instant startDate, Instant endDate, Timeframe timeframe, Map<WidgetSetting, Object> settings) {

    public WidgetRequest withDates(Instant startDate, Instant endDate) {
        return new WidgetRequest(startDate, endDate, this.timeframe, this.settings);
    }
}
