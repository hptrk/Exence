package com.exence.finance.modules.statistics.dto.response;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;

@Schema(
        title = "Chart Widget DTO",
        description =
                "Represents a chart widget's layout and configuration. It is used to provide the necessary information"
                        + " for rendering chart widgets on the dashboard.")
public record ChartWidgetDTO(
        @Schema(
                        description =
                                "The unique identifier for the chart widget. It is used to reference the widget in API calls",
                        example = "1")
                Long id,
        @Schema(
                        description =
                                "The type of the widget. This field helps the frontend determine how to render the widget.",
                        example = "INCOME_TREND")
                StatisticsWidgetType type,
        @Schema(
                        description =
                                "The title of the chart widget. It should provide a clear indication of what data the chart"
                                        + " represents.",
                        example = "Income Trend")
                String title,
        @Schema(
                        description =
                                "The timeframe for which the chart data is displayed. This field allows the frontend to"
                                        + " request the appropriate data based on the selected timeframe.",
                        example = "1Y")
                Timeframe timeframe,
        @Schema(
                        description =
                                "The x-coordinate of the chart's position on the dashboard grid. This value is used to"
                                        + " determine where the widget is placed horizontally.",
                        example = "1")
                Integer x,
        @Schema(
                        description =
                                "The y-coordinate of the chart's position on the dashboard grid. This value is used to"
                                        + " determine where the widget is placed vertically.",
                        example = "1")
                Integer y,
        @Schema(
                        description =
                                "The number of columns the chart spans on the dashboard grid. This value is used to"
                                        + " determine the widget's width.",
                        example = "2")
                Integer cols,
        @Schema(
                        description = "The number of rows the chart spans on the dashboard grid. This value is used to"
                                + " determine the widget's height.",
                        example = "2")
                Integer rows,
        Map<WidgetSetting, Object> settings) {}
