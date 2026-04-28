package com.exence.finance.modules.statistics.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Set;

@Schema(description = "Base interface for all widget types in the application.")
@JsonDeserialize(using = WidgetTypeDeserializer.class)
public interface WidgetType {
    /**
     * Set of widget types that represent stat cards. Each implementing enum must define its own
     * STAT_CARD_TYPES constant.
     */
    Set<? extends WidgetType> getStatCardTypes();

    /**
     * Set of widget types that represent graphs/charts. Each implementing enum must define its own
     * GRAPH_TYPES constant.
     */
    Set<? extends WidgetType> getGraphTypes();

    /**
     * Checks if this widget type is a stat card. Default implementation checks against the
     * STAT_CARD_TYPES set.
     *
     * @return true if this widget is a stat card, false otherwise
     */
    default boolean isStatCard() {
        return getStatCardTypes().contains(this);
    }

    /**
     * Checks if this widget type is a graph/chart. Default implementation checks against the
     * GRAPH_TYPES set.
     *
     * @return true if this widget is a graph, false otherwise
     */
    default boolean isGraph() {
        return getGraphTypes().contains(this);
    }
}
