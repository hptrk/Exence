package com.exence.finance.modules.statistics.controller;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import com.exence.finance.modules.statistics.dto.WidgetCreateDTO;
import com.exence.finance.modules.statistics.dto.response.WidgetDataResponse;
import com.exence.finance.modules.statistics.dto.response.WidgetLayoutResponse;
import org.springframework.http.ResponseEntity;

public interface WidgetController {

    ResponseEntity<WidgetLayoutResponse> getLayout();

    ResponseEntity<WidgetDataResponse> getWidgetData(Long widgetId, Timeframe timeframe);

    ResponseEntity<WidgetDataResponse> getDashboardBalanceTrend(Timeframe timeframe);

    ResponseEntity<WidgetLayoutResponse> createWidget(WidgetCreateDTO widgetCreateDTO);

    ResponseEntity<WidgetLayoutResponse> updateLayout(UpdateLayoutRequest request);
}
