package com.exence.finance.modules.statistics.service;

import com.exence.finance.modules.statistics.dto.debt.DebtWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;

public interface DebtWidgetService {

    DebtWidgetDataResponse getWidgetData(DebtWidgetType type);
}
