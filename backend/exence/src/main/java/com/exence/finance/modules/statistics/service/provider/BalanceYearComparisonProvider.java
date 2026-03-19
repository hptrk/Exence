package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.projection.MonthlyBalanceProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import java.time.YearMonth;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class BalanceYearComparisonProvider implements WidgetDataProvider {

    private static final int MONTHS_IN_YEAR = 12;

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.BALANCE_YEAR_COMPARISON;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        List<MonthlyBalanceProjection> results =
                statisticsRepository.findMonthlyBalance(request.startDate(), request.endDate());

        Set<Integer> years = results.stream()
                .map(MonthlyBalanceProjection::getStatYear)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        List<SeriesItem> series = years.stream()
                .map(year -> {
                    List<DataPoint> points = IntStream.rangeClosed(1, MONTHS_IN_YEAR)
                            .mapToObj(monthNumber -> new DataPoint(
                                    DateUtils.getMonthName(monthNumber),
                                    ProviderHelper.getAmount(
                                            results,
                                            YearMonth.of(year, monthNumber),
                                            MonthlyBalanceProjection::getTotalAmount),
                                    null))
                            .toList();
                    return new SeriesItem(String.valueOf(year), "line", null, points);
                })
                .toList();

        return new SeriesPayload(series);
    }
}
