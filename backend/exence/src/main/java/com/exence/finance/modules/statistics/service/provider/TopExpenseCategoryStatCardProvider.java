package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.dto.result.CategoryAmountResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class TopExpenseCategoryStatCardProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.TOP_EXPENSE_CATEGORY_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request, TransactionType.EXPENSE);
        CategoryAmountResult top = statisticsQueryService.findTopCategoryByType(filter);

        if (top == null) {
            return new StatCardPayload(BigDecimal.ZERO, null, "No transactions", null, null, null, null);
        }

        TrendResult trend = ProviderHelper.computeTrend(request, top.totalAmount(), (s, e) -> {
            CategoryAmountResult prev = statisticsQueryService.findTopCategoryByType(
                    filterFactory.fromRequest(request.withDates(s, e), TransactionType.EXPENSE));
            return prev != null ? prev.totalAmount() : BigDecimal.ZERO;
        });

        return new StatCardPayload(
                top.totalAmount(),
                null,
                top.categoryName(),
                trend.changePercentage(),
                trend.trend(),
                top.categoryIcon(),
                top.categoryColor());
    }
}
