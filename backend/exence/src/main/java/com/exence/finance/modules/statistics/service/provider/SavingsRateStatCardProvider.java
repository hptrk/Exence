package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.i18n.I18nService;
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

    private final I18nService i18n;
    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;
    private final ProviderHelper providerHelper;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.SAVINGS_RATE_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        BigDecimal savingsRate = calculateSavingsRate(request.startDate(), request.endDate());
        TrendResult trend = providerHelper.computeTrendByDifference(request, savingsRate, this::calculateSavingsRate);
        return new StatCardPayload(
                savingsRate, i18n.get("unit.percent"), null, trend.changePercentage(), trend.trend(), null, null);
    }

    private BigDecimal calculateSavingsRate(Instant start, Instant end) {
        Map<TransactionType, BigDecimal> sums =
                providerHelper.toTypeAmountMap(statisticsQueryService.sumByType(filterFactory.forPeriod(start, end)));
        return providerHelper.calculateSavingsRate(
                sums.getOrDefault(TransactionType.INCOME, BigDecimal.ZERO),
                sums.getOrDefault(TransactionType.EXPENSE, BigDecimal.ZERO));
    }
}
