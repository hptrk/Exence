package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class BurnRateStatCardProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;
    private final ProviderHelper providerHelper;
    private final I18nService i18n;

    @Override
    public StatisticsWidgetType getSupportedType() {
        return StatisticsWidgetType.BURN_RATE_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        BigDecimal dailyBurnRate = calculateBurnRate(request.startDate(), request.endDate());
        TrendResult trend = providerHelper.computeTrend(request, dailyBurnRate, this::calculateBurnRate);
        return new StatCardPayload(
                getSupportedType(),
                dailyBurnRate,
                providerHelper.getUserCurrencySymbol(),
                i18n.get("context.per-day"),
                trend.changePercentage(),
                trend.trend(),
                null,
                null);
    }

    private BigDecimal calculateBurnRate(LocalDate start, LocalDate end) {
        BigDecimal expense =
                statisticsQueryService.sumAmountByType(filterFactory.forPeriod(start, end, TransactionType.EXPENSE));
        long days = DateUtils.countDaysBetween(start, end);
        return expense.divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP);
    }
}
