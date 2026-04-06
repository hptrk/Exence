package com.exence.finance.modules.statistics.dto.debt;

import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;

public record DebtWidgetDataResponse(DebtWidgetType type, WidgetDataPayload payload) {}
