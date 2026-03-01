package com.exence.finance.modules.statistics.dto.response;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetType;

public record ChartWidgetDTO(Long id, WidgetType type, String title, Timeframe timeframe, int x, int y) {}
