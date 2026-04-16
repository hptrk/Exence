package com.exence.finance.modules.statistics.dto.goal;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

@Schema(description = "Enumeration of widget types available in the goal tracking module.")
public enum GoalWidgetType implements WidgetType {
    GOAL_ACTIVE_COUNT_STATCARD,
    GOAL_AVG_PROGRESS_STATCARD,
    GOAL_COMPLETION_RATE_STATCARD,
    GOAL_NEXT_DEADLINE_STATCARD,
    GOAL_PROGRESS_TREND,
    GOAL_TARGET_DISTRIBUTION_PIE,
    GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD,
    GOAL_TOTAL_SAVINGS_STATCARD;

    public static final Set<GoalWidgetType> STAT_CARD_TYPES = EnumSet.of(
            GOAL_ACTIVE_COUNT_STATCARD,
            GOAL_AVG_PROGRESS_STATCARD,
            GOAL_COMPLETION_RATE_STATCARD,
            GOAL_NEXT_DEADLINE_STATCARD,
            GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD,
            GOAL_TOTAL_SAVINGS_STATCARD);

    public static final Set<GoalWidgetType> GRAPH_TYPES =
            Collections.unmodifiableSet(EnumSet.complementOf(EnumSet.copyOf(STAT_CARD_TYPES)));

    @Override
    public Set<? extends WidgetType> getStatCardTypes() {
        return STAT_CARD_TYPES;
    }

    @Override
    public Set<? extends WidgetType> getGraphTypes() {
        return GRAPH_TYPES;
    }
}
