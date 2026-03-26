package com.exence.finance.modules.statistics.dto.response;

import com.exence.finance.modules.statistics.dto.WidgetSetting;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import java.util.Map;

public record WidgetDataResponse(
        Long widgetId, WidgetType type, WidgetDataPayload payload, Map<WidgetSetting, Object> settings) {}
