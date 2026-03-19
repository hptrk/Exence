package com.exence.finance.modules.statistics.dto.response;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import com.exence.finance.modules.statistics.dto.WidgetType;
import java.util.Map;

public record StatCardWidgetDTO(
        Long id,
        WidgetType type,
        String title,
        String info,
        Timeframe timeframe,
        Integer displayOrder,
        Map<WidgetSetting, Object> settings) {}
