package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class NoSpendDaysStatCardProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;
    private final UserService userService;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.NO_SPEND_DAYS_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        Long userId = userService.getCurrentUserId();
        Long noSpendDays = statisticsRepository.countNoSpendDays(userId, request.startDate(), request.endDate());
        long totalDays = DateUtils.countDaysBetween(request.startDate(), request.endDate());

        TrendResult trend = ProviderHelper.computeTrend(request, BigDecimal.valueOf(noSpendDays),
                (s, e) -> BigDecimal.valueOf(statisticsRepository.countNoSpendDays(userId, s, e)));

        String unitLabel = ProviderHelper.getUnitLabel(noSpendDays, "day", "days");
        return new StatCardPayload(
                BigDecimal.valueOf(noSpendDays),
                unitLabel,
                "/" + totalDays + " days",
                trend.changePercentage(),
                trend.trend(),
                null,
                null);
    }
}
