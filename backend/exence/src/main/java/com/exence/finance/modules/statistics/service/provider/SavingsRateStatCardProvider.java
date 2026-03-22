package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class SavingsRateStatCardProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.SAVINGS_RATE_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        BigDecimal savingsRate = calculateSavingsRate(request.startDate(), request.endDate());
        TrendResult trend = ProviderHelper.computeTrendByDifference(request, savingsRate, this::calculateSavingsRate);
        return new StatCardPayload(savingsRate, "%", null, trend.changePercentage(), trend.trend(), null, null);
    }

    private BigDecimal calculateSavingsRate(Instant start, Instant end) {
        Map<TransactionType, BigDecimal> sums =
                ProviderHelper.toTypeAmountMap(statisticsQueryService.sumByType(filterFactory.forPeriod(start, end)));
        return ProviderHelper.calculateSavingsRate(
                sums.getOrDefault(TransactionType.INCOME, BigDecimal.ZERO),
                sums.getOrDefault(TransactionType.EXPENSE, BigDecimal.ZERO));
    }
}
