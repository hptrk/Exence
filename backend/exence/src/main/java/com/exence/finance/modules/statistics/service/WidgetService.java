package com.exence.finance.modules.statistics.service;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import com.exence.finance.modules.statistics.dto.WidgetDTO;
import com.exence.finance.modules.statistics.dto.response.WidgetDataResponse;
import com.exence.finance.modules.statistics.dto.response.WidgetLayoutResponse;

public interface WidgetService {

    WidgetLayoutResponse getLayout();

    WidgetDataResponse getWidgetData(Long widgetId, Timeframe timeframe);

    WidgetDataResponse getDashboardBalanceTrend(Timeframe timeframe);

    WidgetLayoutResponse createWidget(WidgetDTO widgetDTO);

    WidgetLayoutResponse updateLayout(UpdateLayoutRequest request);
}
