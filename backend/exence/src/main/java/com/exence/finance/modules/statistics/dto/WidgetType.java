package com.exence.finance.modules.statistics.dto;

import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

public enum WidgetType {
    // --- Stat Cards ---
    EXAMPLE_STATCARD,

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
    CATEGORY_SANKEY;

    public static final Set<WidgetType> STAT_CARD_TYPES = EnumSet.of(WidgetType.EXAMPLE_STATCARD);

    public static final Set<WidgetType> GRAPH_TYPES =
            Collections.unmodifiableSet(EnumSet.complementOf(EnumSet.copyOf(STAT_CARD_TYPES)));

    public static final Set<WidgetType> YTD_ONLY_TYPES = EnumSet.of(WidgetType.SPENDING_HEATMAP);

    public boolean isStatCard() {
        return STAT_CARD_TYPES.contains(this);
    }

    public boolean isGraph() {
        return GRAPH_TYPES.contains(this);
    }

    public boolean isYtdOnly() {
        return YTD_ONLY_TYPES.contains(this);
    }
}
