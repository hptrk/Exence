package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
        description =
                "Sealed interface representing widget data payloads. Each implementation corresponds to a specific"
                        + " visualization type and contains the necessary data for rendering that widget. The 'type' field"
                        + " indicates which widget type this payload represents.",
        oneOf = {
            SeriesPayload.class,
            BoxplotPayload.class,
            BubblePayload.class,
            DistributionPayload.class,
            GaugePayload.class,
            SankeyPayload.class,
            SlopePayload.class,
            StatCardPayload.class,
            LeaderboardPayload.class,
            SummaryPayload.class
        },
        discriminatorProperty = "type")
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
// @JsonSubTypes({
//    @JsonSubTypes.Type(value = BoxplotPayload.class, name = "BOXPLOT"),
//    @JsonSubTypes.Type(value = BubblePayload.class, name = "BUBBLE"),
//    @JsonSubTypes.Type(value = DistributionPayload.class, name = "DISTRIBUTION"),
//    @JsonSubTypes.Type(value = GaugePayload.class, name = "GAUGE" ),
//    @JsonSubTypes.Type(value = SankeyPayload.class, name = "SANKEY"),
//    @JsonSubTypes.Type(value = SeriesPayload.class, name = "SERIES"),
//    @JsonSubTypes.Type(value = SlopePayload.class, name = "SLOPE"),
//    @JsonSubTypes.Type(value = StatCardPayload.class, name = "STATCARD"),
//    @JsonSubTypes.Type(value = LeaderboardPayload.class, name = "LEADERBOARD"),
//    @JsonSubTypes.Type(value = SummaryPayload.class, name = "SUMMARY")
// })
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
