package com.exence.finance.modules.statistics.dto.response;

import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;

public record WidgetDataResponse(Long widgetId, WidgetType type, WidgetDataPayload payload) {}
