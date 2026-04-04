package com.exence.finance.modules.statistics.controller;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import org.springframework.http.ResponseEntity;

public interface AdminWidgetController {

    ResponseEntity<AdminWidgetDataResponse> getWidgetData(AdminWidgetType type, Timeframe timeframe);
}
