package com.exence.finance.modules.statistics.service;

import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;

public interface InvestmentWidgetService {

    InvestmentWidgetDataResponse getWidgetData(InvestmentWidgetType type);
}
