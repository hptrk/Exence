package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.dto.result.TopTransactionResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class TopIncomeTransactionStatCardProvider implements WidgetDataProvider {

    private final I18nService i18n;
    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;
    private final ProviderHelper providerHelper;

    @Override
    public StatisticsWidgetType getSupportedType() {
        return StatisticsWidgetType.TOP_INCOME_TRANSACTION_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request, TransactionType.INCOME);
        TopTransactionResult current = statisticsQueryService.findTopTransactionByType(filter);

        if (current == null) {
            return new StatCardPayload(
                    getSupportedType(),
                    BigDecimal.ZERO,
                    null,
                    i18n.get("label.no-transactions"),
                    null,
                    null,
                    null,
                    null);
        }

        TrendResult trend = providerHelper.computeTrend(request, current.amount(), (s, e) -> {
            TopTransactionResult prev = statisticsQueryService.findTopTransactionByType(
                    filterFactory.fromRequest(request.withDates(s, e), TransactionType.INCOME));
            return prev != null ? prev.amount() : BigDecimal.ZERO;
        });

        return new StatCardPayload(
                getSupportedType(),
                current.amount(),
                null,
                current.title(),
                trend.changePercentage(),
                trend.trend(),
                current.categoryIcon(),
                current.categoryColor());
    }
}
