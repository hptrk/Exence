package com.exence.finance.modules.statistics.dto.goal;

import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;

public record GoalWidgetDataResponse(GoalWidgetType type, WidgetDataPayload payload) {}
