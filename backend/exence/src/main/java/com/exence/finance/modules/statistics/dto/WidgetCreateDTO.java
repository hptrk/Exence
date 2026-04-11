package com.exence.finance.modules.statistics.dto;

import com.exence.finance.modules.statistics.annotations.ValidWidgetLayout;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

@Schema(
        description =
                "DTO representing a widget on the statistics dashboard. A widget can be a graph or a statistics card.")
@ValidWidgetLayout
public record WidgetCreateDTO(
        @Schema(
                        description =
                                "Type of the widget. It can be chosen from a wide variety of graphs and statistics cards.",
                        example = "BAR_CHART")
                @NotNull
                StatisticsWidgetType type,
        String title,
        Timeframe timeframe,
        @Schema(
                        description =
                                "Order of the statistics cards in the dashboard layout. It is empty if widget type is graph.",
                        example = "1")
                Integer displayOrder,
        @Schema(
                        description =
                                "X coordinate of the graph in the dashboard layout. It is empty if widget type is statistics"
                                        + " card.",
                        example = "1")
                Integer x,
        @Schema(
                        description =
                                "Y coordinate of the graph in the dashboard layout. It is empty if widget type is statistics"
                                        + " card.",
                        example = "1")
                Integer y,
        @Schema(
                        description =
                                "Number of columns the graph spans in the dashboard layout. It is empty if widget type is"
                                        + " statistics card.",
                        example = "2")
                Integer cols,
        @Schema(
                        description =
                                "Number of rows the graph spans in the dashboard layout. It is empty if widget type is"
                                        + " statistics card.",
                        example = "2")
                Integer rows,
        @Schema(
                        description =
                                "Additional settings specific to the widget type. The exact keys and values depend on the"
                                        + " widget type and its configuration.")
                Map<WidgetSetting, Object> settings) {}
