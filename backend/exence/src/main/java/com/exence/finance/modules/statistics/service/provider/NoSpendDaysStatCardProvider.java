package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class NoSpendDaysStatCardProvider implements WidgetDataProvider {

    private final I18nService i18n;
    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;
    private final ProviderHelper providerHelper;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.NO_SPEND_DAYS_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        StatisticsFilter currentFilter = filterFactory.fromRequest(request);
        Long noSpendDays = statisticsQueryService.countNoSpendDays(currentFilter);
        long totalDays = DateUtils.countDaysBetween(request.startDate(), request.endDate());

        TrendResult trend = providerHelper.computeTrend(request, BigDecimal.valueOf(noSpendDays), (s, e) -> {
            StatisticsFilter filter = filterFactory.fromRequest(request.withDates(s, e));
            return BigDecimal.valueOf(statisticsQueryService.countNoSpendDays(filter));
        });

        String unitLabel = i18n.getUnitLabel(noSpendDays, "unit.day", "unit.days");
        return new StatCardPayload(
                BigDecimal.valueOf(noSpendDays),
                unitLabel,
                i18n.get("context.of-days", totalDays),
                trend.changePercentage(),
                trend.trend(),
                null,
                null);
    }
}
