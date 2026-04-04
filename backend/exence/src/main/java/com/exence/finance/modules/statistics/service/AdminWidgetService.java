package com.exence.finance.modules.statistics.service;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;

public interface AdminWidgetService {

    AdminWidgetDataResponse getWidgetData(AdminWidgetType type, Timeframe timeframe);
}
