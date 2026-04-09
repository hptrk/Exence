package com.exence.finance.modules.statistics.dto.investment;

import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;

public record InvestmentWidgetDataResponse(InvestmentWidgetType type, WidgetDataPayload payload) {}
