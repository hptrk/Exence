package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.dto.projection.CategoryAmountProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class TopExpenseCategoryStatCardProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.TOP_EXPENSE_CATEGORY_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        CategoryAmountProjection top = statisticsRepository.findTopCategoryByType(
                request.startDate(), request.endDate(), TransactionType.EXPENSE);

        if (top == null) {
            return new StatCardPayload(BigDecimal.ZERO, null, "No transactions", null, null, null, null);
        }

        TrendResult trend = ProviderHelper.computeTrend(request, top.getTotalAmount(), (s, e) -> {
            CategoryAmountProjection prev = statisticsRepository.findTopCategoryByType(s, e, TransactionType.EXPENSE);
            return prev != null ? prev.getTotalAmount() : BigDecimal.ZERO;
        });

        return new StatCardPayload(
                top.getTotalAmount(),
                null,
                top.getCategoryName(),
                trend.changePercentage(),
                trend.trend(),
                top.getCategoryIcon(),
                top.getCategoryColor());
    }
}
