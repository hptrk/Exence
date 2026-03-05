package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class BurnRateStatCardProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.BURN_RATE_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        BigDecimal dailyBurnRate = calculateBurnRate(request.startDate(), request.endDate());
        TrendResult trend = ProviderHelper.computeTrend(request, dailyBurnRate, this::calculateBurnRate);
        return new StatCardPayload(
                dailyBurnRate, "Ft", "/day", trend.changePercentage(), trend.trend(), null, null);
    }

    private BigDecimal calculateBurnRate(Instant start, Instant end) {
        BigDecimal expense = statisticsRepository.sumAmountByType(start, end, TransactionType.EXPENSE);
        long days = DateUtils.countDaysBetween(start, end);
        return expense.divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP);
    }
}
