package com.exence.finance.modules.statistics.dto.admin;

import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;

public record AdminWidgetDataResponse(AdminWidgetType type, WidgetDataPayload payload) {}
