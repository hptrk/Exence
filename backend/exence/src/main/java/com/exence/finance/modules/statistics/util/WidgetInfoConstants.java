package com.exence.finance.modules.statistics.util;

// TODO: These info values will be replaced with translation keys sent to the frontend.

import com.exence.finance.modules.statistics.dto.WidgetType;
import java.util.Map;
import lombok.experimental.UtilityClass;

@UtilityClass
public final class WidgetInfoConstants {

    private static final Map<WidgetType, String> INFO_MAP = Map.ofEntries(

            // --- Stat Cards ---
            Map.entry(
                    WidgetType.EXPENSE_FREQUENCY_STATCARD,
                    "Total number of expense transactions in the selected period, with a trend comparing to the"
                            + " previous period."),
            Map.entry(
                    WidgetType.INCOME_FREQUENCY_STATCARD,
                    "Total number of income transactions in the selected period, with a trend comparing to the"
                            + " previous period."),
            Map.entry(
                    WidgetType.NO_SPEND_DAYS_STATCARD,
                    "Number of days with zero expenses in the selected period. More no-spend days can indicate better"
                            + " spending discipline."),
            Map.entry(
                    WidgetType.TOP_EXPENSE_CATEGORY_STATCARD,
                    "Your highest expense category by total amount, with a trend comparing to the previous period."),
            Map.entry(
                    WidgetType.TOP_INCOME_CATEGORY_STATCARD,
                    "Your highest income category by total amount, with a trend comparing to the previous period."),
            Map.entry(
                    WidgetType.TOP_EXPENSE_TRANSACTION_STATCARD,
                    "Your single largest expense transaction in the selected period, with a trend comparing to the"
                            + " previous period."),
            Map.entry(
                    WidgetType.TOP_INCOME_TRANSACTION_STATCARD,
                    "Your single largest income transaction in the selected period, with a trend comparing to the"
                            + " previous period."),
            Map.entry(
                    WidgetType.BURN_RATE_STATCARD,
                    "Average daily spending in the selected period. The trend shows how it changed compared to the"
                            + " previous period."),
            Map.entry(
                    WidgetType.SAVINGS_RATE_STATCARD,
                    "Percentage of income saved in the selected period. The trend shows the change in percentage"
                            + " points compared to the previous period."),

            // --- Area/Line trends ---
            Map.entry(
                    WidgetType.INCOME_TREND,
                    "Total income over time as an area chart, helping you spot seasonal patterns or growth trends."),
            Map.entry(
                    WidgetType.EXPENSE_TREND,
                    "Total expenses over time as an area chart, helping you identify spending spikes or consistent"
                            + " patterns."),
            Map.entry(
                    WidgetType.BALANCE_TREND,
                    "Net balance (income minus expenses) over time, showing whether you are accumulating or depleting"
                            + " savings."),
            Map.entry(
                    WidgetType.INCOME_CATEGORY_TREND,
                    "Income broken down by category over time as stacked lines, showing how each source contributes to"
                            + " your total."),
            Map.entry(
                    WidgetType.EXPENSE_CATEGORY_TREND,
                    "Expenses broken down by category over time as stacked lines, revealing which categories drive"
                            + " your spending each month."),
            Map.entry(
                    WidgetType.BALANCE_YEAR_COMPARISON,
                    "Cumulative balance compared across different years on the same timeline, making it easy to spot"
                            + " year-over-year improvements."),

            // --- Column/Bar ---
            Map.entry(
                    WidgetType.INCOME_EXPENSE_COLUMN,
                    "Monthly income and expense columns side by side, giving a clear visual comparison of cash inflow"
                            + " versus outflow."),
            Map.entry(
                    WidgetType.EXPENSE_CATEGORY_COLUMN,
                    "Monthly expense breakdown by category as stacked columns, revealing how your spending composition"
                            + " changes over time."),
            Map.entry(
                    WidgetType.MONTHLY_BALANCE_COLUMN,
                    "Monthly net balance as positive or negative columns, instantly highlighting profitable and"
                            + " loss-making months."),

            // --- Mixed/Combo ---
            Map.entry(
                    WidgetType.EXPENSE_SAVINGS_COMBO,
                    "Monthly expense columns paired with a savings rate line, showing how your savings rate holds up"
                            + " even when spending fluctuates."),
            Map.entry(
                    WidgetType.TRANSACTION_COUNT_EXPENSE_COMBO,
                    "Total expense columns paired with a transaction count line, revealing whether large totals come"
                            + " from many small purchases or a few big ones."),
            Map.entry(
                    WidgetType.WEALTH_GROWTH_COMBO,
                    "Monthly net profit columns combined with a cumulative balance line, visualizing how small monthly"
                            + " gains compound into long-term wealth growth."),

            // --- Pie/Donut ---
            Map.entry(
                    WidgetType.EXPENSE_PIE,
                    "Proportion of each expense category as a slice of the total, making it easy to see where most of"
                            + " your money goes."),
            Map.entry(
                    WidgetType.INCOME_PIE,
                    "Proportion of each income category as a slice of the total, highlighting your main sources of"
                            + " revenue."),

            // --- Radar ---
            Map.entry(
                    WidgetType.SPENDING_RADAR,
                    "Your spending profile across categories on a radar chart. The further a point extends, the more"
                            + " dominant that category is in your financial life."),
            Map.entry(
                    WidgetType.MONTHLY_CATEGORY_RADAR,
                    "Multiple months of category spending overlaid on a radar chart, revealing seasonal shifts in your"
                            + " spending habits."),

            // --- Polar Area ---
            Map.entry(
                    WidgetType.CATEGORY_AVG_POLAR,
                    "Average transaction value per category as a polar area chart. Larger slices indicate categories"
                            + " with bigger individual transactions."),
            Map.entry(
                    WidgetType.MONTHLY_PEAK_POLAR,
                    "Highest single-day expense for each month as a polar area chart, highlighting months with"
                            + " particularly large spending spikes."),

            // --- Bubble ---
            Map.entry(
                    WidgetType.CATEGORY_BUBBLE,
                    "Categories plotted by transaction count, average value, and total spent (bubble size), revealing"
                            + " whether costs come from frequent small or rare large purchases."),

            // --- Scatter ---
            Map.entry(
                    WidgetType.TRANSACTION_SCATTER,
                    "Individual transactions scattered by date and amount, helping you spot outliers, clusters, and"
                            + " day-of-month spending patterns."),

            // --- Heatmap ---
            Map.entry(
                    WidgetType.SPENDING_HEATMAP,
                    "Daily spending intensity on a weekday-by-week grid. Darker cells indicate higher spending,"
                            + " revealing your most and least expensive days."),

            // --- Treemap ---
            Map.entry(
                    WidgetType.CATEGORY_TREEMAP,
                    "Category spending shown as proportionally sized rectangles. Larger rectangles represent"
                            + " categories where you spend the most."),

            // --- Boxplot ---
            Map.entry(
                    WidgetType.CATEGORY_BOXPLOT,
                    "Range and variability of spending within each category as box-and-whisker plots, highlighting"
                            + " which categories have the most unpredictable costs."),
            Map.entry(
                    WidgetType.MONTHLY_BOXPLOT,
                    "Daily spending distribution for each month as box plots, revealing which months had the most"
                            + " volatile day-to-day spending."),

            // --- Gauge ---
            Map.entry(
                    WidgetType.SAVINGS_RATE_GAUGE,
                    "Your current savings rate displayed as a gauge, providing an at-a-glance view of how much of your"
                            + " income you are putting aside."),

            // --- Slope ---
            Map.entry(
                    WidgetType.YEARLY_SLOPE,
                    "Category spending compared across years as a slope chart, making it easy to see which categories"
                            + " grew or shrank year over year."),

            // --- Sankey ---
            Map.entry(
                    WidgetType.CATEGORY_SANKEY,
                    "Flow of money from income categories through to expense categories, showing how your earnings are"
                            + " distributed across spending."));

    public static String getInfo(WidgetType type) {
        return INFO_MAP.getOrDefault(type, "");
    }
}
