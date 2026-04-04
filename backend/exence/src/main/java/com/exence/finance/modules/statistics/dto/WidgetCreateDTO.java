package com.exence.finance.modules.statistics.dto;

import com.exence.finance.modules.statistics.annotations.ValidWidgetLayout;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

@ValidWidgetLayout
public record WidgetCreateDTO(
        @NotNull WidgetType type,
        String title,
        Timeframe timeframe,
        Integer displayOrder,
        Integer x,
        Integer y,
        Integer cols,
        Integer rows,
        Map<WidgetSetting, Object> settings) {}
