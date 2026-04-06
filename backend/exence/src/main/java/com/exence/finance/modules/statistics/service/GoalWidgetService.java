package com.exence.finance.modules.statistics.service;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;

public interface GoalWidgetService {

    GoalWidgetDataResponse getWidgetData(GoalWidgetType type, Timeframe timeframe, Long goalId);
}
