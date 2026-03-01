package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;

public sealed interface WidgetDataProvider
        permits BalanceTrendProvider,
                BalanceYearComparisonProvider,
                CategoryAvgPolarProvider,
                CategoryBoxplotProvider,
                CategoryBubbleProvider,
                CategoryTreemapProvider,
                ExpenseCategoryColumnProvider,
                ExpenseCategoryTrendProvider,
                ExpensePieProvider,
                ExpenseSavingsComboProvider,
                ExpenseTrendProvider,
                IncomeExpenseColumnProvider,
                IncomeCategoryTrendProvider,
                IncomePieProvider,
                IncomeTrendProvider,
                MonthlyBalanceColumnProvider,
                MonthlyBoxplotProvider,
                MonthlyCategoryRadarProvider,
                MonthlyPeakPolarProvider,
                SankeyProvider,
                SavingsGaugeProvider,
                SpendingHeatmapProvider,
                SpendingRadarProvider,
                StatCardProvider,
                TransactionScatterProvider,
                TransactionCountExpenseComboProvider,
                WealthGrowthComboProvider,
                YearlySlopeProvider {

    WidgetType getSupportedType();

    WidgetDataPayload getData(WidgetRequest request);
}
