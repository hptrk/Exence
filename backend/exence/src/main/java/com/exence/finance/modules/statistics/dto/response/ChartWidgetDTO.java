package com.exence.finance.modules.statistics.dto.response;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetType;

public record ChartWidgetDTO(
        Long id,
        WidgetType type,
        String title,
        String info,
        Timeframe timeframe,
        Integer x,
        Integer y,
        Integer cols,
        Integer rows) {}
