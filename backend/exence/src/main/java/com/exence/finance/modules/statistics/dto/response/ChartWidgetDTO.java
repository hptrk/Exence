package com.exence.finance.modules.statistics.dto.response;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import com.exence.finance.modules.statistics.dto.WidgetType;
import java.util.Map;

public record ChartWidgetDTO(
        Long id,
        WidgetType type,
        String title,
        Timeframe timeframe,
        Integer x,
        Integer y,
        Integer cols,
        Integer rows,
        Map<WidgetSetting, Object> settings) {}
