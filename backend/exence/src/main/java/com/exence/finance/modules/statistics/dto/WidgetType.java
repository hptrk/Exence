package com.exence.finance.modules.statistics.dto;

import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

public enum WidgetType {
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

    public static final Set<WidgetType> STAT_CARD_TYPES = EnumSet.of(
            WidgetType.EXPENSE_FREQUENCY_STATCARD,
            WidgetType.INCOME_FREQUENCY_STATCARD,
            WidgetType.NO_SPEND_DAYS_STATCARD,
            WidgetType.TOP_EXPENSE_CATEGORY_STATCARD,
            WidgetType.TOP_INCOME_CATEGORY_STATCARD,
            WidgetType.TOP_EXPENSE_TRANSACTION_STATCARD,
            WidgetType.TOP_INCOME_TRANSACTION_STATCARD,
            WidgetType.BURN_RATE_STATCARD,
            WidgetType.SAVINGS_RATE_STATCARD);

    public static final Set<WidgetType> GRAPH_TYPES =
            Collections.unmodifiableSet(EnumSet.complementOf(EnumSet.copyOf(STAT_CARD_TYPES)));

    public static final Set<WidgetType> YTD_ONLY_TYPES = EnumSet.of(WidgetType.SPENDING_HEATMAP);

    public static final Set<WidgetType> CATEGORY_FILTERABLE_TYPES = Collections.unmodifiableSet(EnumSet.of(
            INCOME_TREND,
            EXPENSE_TREND,
            BALANCE_TREND,
            INCOME_CATEGORY_TREND,
            EXPENSE_CATEGORY_TREND,
            BALANCE_YEAR_COMPARISON,
            INCOME_EXPENSE_COLUMN,
            EXPENSE_CATEGORY_COLUMN,
            MONTHLY_BALANCE_COLUMN,
            EXPENSE_SAVINGS_COMBO,
            TRANSACTION_COUNT_EXPENSE_COMBO,
            WEALTH_GROWTH_COMBO,
            EXPENSE_PIE,
            INCOME_PIE,
            SPENDING_RADAR,
            MONTHLY_CATEGORY_RADAR,
            CATEGORY_AVG_POLAR,
            MONTHLY_PEAK_POLAR,
            CATEGORY_BUBBLE,
            TRANSACTION_SCATTER,
            SPENDING_HEATMAP,
            CATEGORY_TREEMAP,
            CATEGORY_BOXPLOT,
            MONTHLY_BOXPLOT,
            YEARLY_SLOPE,
            CATEGORY_SANKEY,
            EXPENSE_FREQUENCY_STATCARD,
            INCOME_FREQUENCY_STATCARD,
            NO_SPEND_DAYS_STATCARD,
            TOP_EXPENSE_CATEGORY_STATCARD,
            TOP_INCOME_CATEGORY_STATCARD,
            TOP_EXPENSE_TRANSACTION_STATCARD,
            TOP_INCOME_TRANSACTION_STATCARD,
            BURN_RATE_STATCARD,
            SAVINGS_RATE_STATCARD));

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
