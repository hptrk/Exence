package com.exence.finance.modules.statistics.dto;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record ChartLayoutItemRequest(
        @NotNull Long id,
        @NotNull Integer x,
        @NotNull Integer y,
        @NotNull Integer cols,
        @NotNull Integer rows,
        Map<WidgetSetting, Object> settings,
        String title) {}
