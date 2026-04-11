package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;

public sealed interface WidgetDataProvider
        permits BalanceTrendProvider,
                BalanceYearComparisonProvider,
                BurnRateStatCardProvider,
                CategoryAvgPolarProvider,
                CategoryBoxplotProvider,
                CategoryBubbleProvider,
                CategoryTreemapProvider,
                ExpenseCategoryColumnProvider,
                ExpenseCategoryTrendProvider,
                ExpensePieProvider,
                ExpenseSavingsComboProvider,
                ExpenseTrendProvider,
                ExpenseFrequencyStatCardProvider,
                IncomeFrequencyStatCardProvider,
                IncomeExpenseColumnProvider,
                IncomeCategoryTrendProvider,
                IncomePieProvider,
                IncomeTrendProvider,
                MonthlyBalanceColumnProvider,
                MonthlyBoxplotProvider,
                MonthlyCategoryRadarProvider,
                MonthlyPeakPolarProvider,
                NoSpendDaysStatCardProvider,
                SankeyProvider,
                SavingsGaugeProvider,
                SavingsRateStatCardProvider,
                SpendingHeatmapProvider,
                SpendingRadarProvider,
                TopExpenseCategoryStatCardProvider,
                TopIncomeCategoryStatCardProvider,
                TopExpenseTransactionStatCardProvider,
                TopIncomeTransactionStatCardProvider,
                TransactionScatterProvider,
                TransactionCountExpenseComboProvider,
                WealthGrowthComboProvider,
                YearlySlopeProvider {

    StatisticsWidgetType getSupportedType();

    WidgetDataPayload getData(WidgetRequest request);
}
