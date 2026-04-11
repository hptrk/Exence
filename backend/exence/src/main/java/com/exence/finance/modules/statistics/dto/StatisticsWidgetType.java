package com.exence.finance.modules.statistics.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

@Schema(
        description =
                "Enumeration of all possible widget types that can be used in the statistics module. Each widget type"
                        + " corresponds to a specific way of visualizing financial data, either as stat cards or chart"
                        + " types.")
public enum StatisticsWidgetType implements WidgetType {
    // --- Stat Cards ---
    EXPENSE_FREQUENCY_STATCARD,
    INCOME_FREQUENCY_STATCARD,
    NO_SPEND_DAYS_STATCARD,
    TOP_EXPENSE_CATEGORY_STATCARD,
    TOP_INCOME_CATEGORY_STATCARD,
    TOP_EXPENSE_TRANSACTION_STATCARD,
    TOP_INCOME_TRANSACTION_STATCARD,
    BURN_RATE_STATCARD,
    SAVINGS_RATE_STATCARD,

    // --- Charts ---

    // Area/Line trends
    INCOME_TREND,
    EXPENSE_TREND,
    BALANCE_TREND,
    INCOME_CATEGORY_TREND,
    EXPENSE_CATEGORY_TREND,
    BALANCE_YEAR_COMPARISON,

    // Column/Bar
    INCOME_EXPENSE_COLUMN,
    EXPENSE_CATEGORY_COLUMN,
    MONTHLY_BALANCE_COLUMN,

    // Mixed
    EXPENSE_SAVINGS_COMBO,
    TRANSACTION_COUNT_EXPENSE_COMBO,
    WEALTH_GROWTH_COMBO,

    // Pie/Donut
    EXPENSE_PIE,
    INCOME_PIE,

    // Radar
    SPENDING_RADAR,
    MONTHLY_CATEGORY_RADAR,

    // Polar Area
    CATEGORY_AVG_POLAR,
    MONTHLY_PEAK_POLAR,

    // Bubble
    CATEGORY_BUBBLE,

    // Scatter
    TRANSACTION_SCATTER,

    // Heatmap
    SPENDING_HEATMAP,

    // Treemap
    CATEGORY_TREEMAP,

    // Boxplot
    CATEGORY_BOXPLOT,
    MONTHLY_BOXPLOT,

    // Gauge
    SAVINGS_RATE_GAUGE,

    // Slope
    YEARLY_SLOPE,

    // Sankey
    CATEGORY_SANKEY,

    // Dashboard
    DASHBOARD_BALANCE_TREND;

    public static final Set<StatisticsWidgetType> STAT_CARD_TYPES = EnumSet.of(
            StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD,
            StatisticsWidgetType.INCOME_FREQUENCY_STATCARD,
            StatisticsWidgetType.NO_SPEND_DAYS_STATCARD,
            StatisticsWidgetType.TOP_EXPENSE_CATEGORY_STATCARD,
            StatisticsWidgetType.TOP_INCOME_CATEGORY_STATCARD,
            StatisticsWidgetType.TOP_EXPENSE_TRANSACTION_STATCARD,
            StatisticsWidgetType.TOP_INCOME_TRANSACTION_STATCARD,
            StatisticsWidgetType.BURN_RATE_STATCARD,
            StatisticsWidgetType.SAVINGS_RATE_STATCARD);

    public static final Set<StatisticsWidgetType> GRAPH_TYPES =
            Collections.unmodifiableSet(EnumSet.complementOf(EnumSet.copyOf(STAT_CARD_TYPES)));

    public static final Set<StatisticsWidgetType> YTD_ONLY_TYPES = EnumSet.of(StatisticsWidgetType.SPENDING_HEATMAP);

    @Override
    public Set<? extends WidgetType> getStatCardTypes() {
        return STAT_CARD_TYPES;
    }

    @Override
    public Set<? extends WidgetType> getGraphTypes() {
        return GRAPH_TYPES;
    }

    public boolean isYtdOnly() {
        return YTD_ONLY_TYPES.contains(this);
    }
}
