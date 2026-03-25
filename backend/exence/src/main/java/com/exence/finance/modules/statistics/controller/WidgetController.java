package com.exence.finance.modules.statistics.controller;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import com.exence.finance.modules.statistics.dto.WidgetDTO;
import com.exence.finance.modules.statistics.dto.response.WidgetDataResponse;
import com.exence.finance.modules.statistics.dto.response.WidgetLayoutResponse;
import org.springframework.http.ResponseEntity;

public interface WidgetController {

    ResponseEntity<WidgetLayoutResponse> getLayout();

    ResponseEntity<WidgetDataResponse> getWidgetData(Long widgetId, Timeframe timeframe);

    ResponseEntity<WidgetDataResponse> getDashboardBalanceTrend(Timeframe timeframe);

    ResponseEntity<WidgetLayoutResponse> createWidget(WidgetDTO widgetDTO);

    ResponseEntity<WidgetLayoutResponse> updateLayout(UpdateLayoutRequest request);
}
