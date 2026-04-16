package com.exence.finance.modules.statistics.dto.response;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;

@Schema(
        title = "Stat Card Widget DTO",
        description = "Represents a statistic card widget on the dashboard. Contains all necessary"
                + " information for rendering the widget, and any specific settings required for its functionality.")
public record StatCardWidgetDTO(
        @Schema(
                        description =
                                "The unique identifier of the widget. It is used for referencing the widget in API calls.",
                        example = "1")
                Long id,
        @Schema(
                        description =
                                "The type of the widget, which determines its visual representation and behavior on the"
                                        + " dashboard.",
                        example = "SAVINGS_RATE_STATCARD")
                StatisticsWidgetType type,
        @Schema(
                        description = "The title displayed on the widget. This should be concise and descriptive of the"
                                + " statistic being shown.",
                        example = "Savings Rate")
                String title,
        @Schema(
                        description =
                                "The timeframe for which the statistic is calculated. This determines the period of data"
                                        + " that the widget will display.",
                        example = "1M")
                Timeframe timeframe,
        @Schema(
                        description =
                                "The order in which the widget is displayed on the dashboard. Widgets with lower display"
                                        + " order values are shown before those with higher values. Should be between 1 and 4.",
                        example = "1")
                Integer displayOrder,
        @Schema(
                        description =
                                "A map of widget-specific settings. This allows for flexible configuration of the widget.")
                Map<WidgetSetting, Object> settings) {}
