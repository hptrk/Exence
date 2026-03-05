package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.dto.projection.TopTransactionProjection;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.repository.TransactionRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class TopIncomeTransactionStatCardProvider implements WidgetDataProvider {

    private final TransactionRepository transactionRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.TOP_INCOME_TRANSACTION_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        TopTransactionProjection current = transactionRepository.findTopTransactionByType(
                request.startDate(), request.endDate(), TransactionType.INCOME);

        if (current == null) {
            return new StatCardPayload(BigDecimal.ZERO, null, "No transactions", null, null, null, null);
        }

        TrendResult trend = ProviderHelper.computeTrend(request, current.getAmount(), (s, e) -> {
            TopTransactionProjection prev =
                    transactionRepository.findTopTransactionByType(s, e, TransactionType.INCOME);
            return prev != null ? prev.getAmount() : BigDecimal.ZERO;
        });

        return new StatCardPayload(
                current.getAmount(), null, current.getTitle(),
                trend.changePercentage(), trend.trend(), null, current.getCategoryColor());
    }
}
