package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
        description =
                "Sealed interface representing widget data payloads. Each implementation corresponds to a specific"
                        + " visualization type and contains the necessary data for rendering that widget. The 'type' field"
                        + " indicates which widget type this payload represents.")
public sealed interface WidgetDataPayload
        permits BoxplotPayload,
                BubblePayload,
                DistributionPayload,
                GaugePayload,
                SankeyPayload,
                SeriesPayload,
                SlopePayload,
                StatCardPayload,
                LeaderboardPayload,
                SummaryPayload {
    /**
     * Returns the type of widget this payload represents.
     *
     * @return the widget type (StatisticsWidgetType, AdminWidgetType, GoalWidgetType, or
     *     DebtWidgetType)
     */
    WidgetType type();
}
