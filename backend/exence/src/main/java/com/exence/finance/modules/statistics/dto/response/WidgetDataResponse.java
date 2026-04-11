package com.exence.finance.modules.statistics.dto.response;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;

@Schema(title = "Widget Data Response DTO", description = "Contains data for a specific widget")
public record WidgetDataResponse(
        @Schema(
                        description =
                                "The unique identifier of the widget. It is used for referencing the widget in API calls",
                        example = "1")
                Long widgetId,
        StatisticsWidgetType type,
        @Schema(
                        description =
                                "Data payload specific to the widget type. The structure of this payload varies based on the"
                                        + " widget type and contains all necessary information for rendering the widget on the"
                                        + " frontend.",
                        example = "SeriesPayload")
                WidgetDataPayload payload,
        Map<WidgetSetting, Object> settings) {}
