package com.exence.finance.modules.statistics.service;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import com.exence.finance.modules.statistics.dto.WidgetCreateDTO;
import com.exence.finance.modules.statistics.dto.response.WidgetDataResponse;
import com.exence.finance.modules.statistics.dto.response.WidgetLayoutResponse;

public interface WidgetService {

    WidgetLayoutResponse getLayout();

    WidgetDataResponse getWidgetData(Long widgetId, Timeframe timeframe);

    WidgetDataResponse getDashboardBalanceTrend(Timeframe timeframe);

    WidgetLayoutResponse createWidget(WidgetCreateDTO widgetCreateDTO);

    WidgetLayoutResponse updateLayout(UpdateLayoutRequest request);
}
