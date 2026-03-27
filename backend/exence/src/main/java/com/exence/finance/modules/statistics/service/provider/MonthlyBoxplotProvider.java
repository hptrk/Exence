package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.BoxplotPayload;
import com.exence.finance.modules.statistics.dto.payload.BoxplotPoint;
import com.exence.finance.modules.statistics.dto.result.MonthlyBoxplotResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class MonthlyBoxplotProvider implements WidgetDataProvider {

    private static final int BOXPLOT_VALUES_COUNT = 5;

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.MONTHLY_BOXPLOT;
    }

    @Override
    public BoxplotPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request);
        List<MonthlyBoxplotResult> results = statisticsQueryService.findBoxplotByMonthExpense(filter);

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());

        List<BigDecimal> zeroValues = Collections.nCopies(BOXPLOT_VALUES_COUNT, BigDecimal.ZERO);

        List<BoxplotPoint> points = months.stream()
                .map(month -> results.stream()
                        .filter(row -> row.year() == month.getYear() && row.month() == month.getMonthValue())
                        .findFirst()
                        .map(row -> new BoxplotPoint(
                                month.toString(),
                                List.of(row.min(), row.q1(), row.median(), row.q3(), row.max()),
                                null))
                        .orElse(new BoxplotPoint(month.toString(), zeroValues, null)))
                .toList();

        return new BoxplotPayload(getSupportedType(), points);
    }
}
