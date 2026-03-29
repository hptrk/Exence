package com.exence.finance.modules.statistics.dto;

import java.time.LocalDate;
import java.util.Map;

public record WidgetRequest(
        LocalDate startDate, LocalDate endDate, Timeframe timeframe, Map<WidgetSetting, Object> settings) {

    public WidgetRequest withDates(LocalDate startDate, LocalDate endDate) {
        return new WidgetRequest(startDate, endDate, this.timeframe, this.settings);
    }
}
