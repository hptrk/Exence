package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.BoxplotPayload;
import com.exence.finance.modules.statistics.dto.payload.BoxplotPoint;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class MonthlyBoxplotProvider implements WidgetDataProvider {

    private static final int YEAR_INDEX = 0;
    private static final int MONTH_INDEX = 1;
    private static final int MIN_INDEX = 2;
    private static final int Q1_INDEX = 3;
    private static final int MEDIAN_INDEX = 4;
    private static final int Q3_INDEX = 5;
    private static final int MAX_INDEX = 6;
    private static final int BOXPLOT_VALUES_COUNT = 5;

    private final StatisticsRepository statisticsRepository;
    private final UserService userService;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.MONTHLY_BOXPLOT;
    }

    @Override
    public BoxplotPayload getData(WidgetRequest request) {
        List<Object[]> results = statisticsRepository.findBoxplotByMonthExpense(
                userService.getCurrentUserId(), request.startDate(), request.endDate());

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());

        List<BigDecimal> zeroValues = Collections.nCopies(BOXPLOT_VALUES_COUNT, BigDecimal.ZERO);

        List<BoxplotPoint> points = months.stream()
                .map(month -> results.stream()
                        .filter(row -> ((Number) row[YEAR_INDEX]).intValue() == month.getYear()
                                && ((Number) row[MONTH_INDEX]).intValue() == month.getMonthValue())
                        .findFirst()
                        .map(row -> new BoxplotPoint(
                                month.toString(),
                                List.of(
                                        ProviderHelper.toBigDecimal(row[MIN_INDEX]),
                                        ProviderHelper.toBigDecimal(row[Q1_INDEX]),
                                        ProviderHelper.toBigDecimal(row[MEDIAN_INDEX]),
                                        ProviderHelper.toBigDecimal(row[Q3_INDEX]),
                                        ProviderHelper.toBigDecimal(row[MAX_INDEX])),
                                null))
                        .orElse(new BoxplotPoint(month.toString(), zeroValues, null)))
                .toList();

        return new BoxplotPayload(points);
    }
}
