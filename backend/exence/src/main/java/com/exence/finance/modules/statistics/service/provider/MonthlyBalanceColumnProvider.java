package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.MonthlyBalanceResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class MonthlyBalanceColumnProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.MONTHLY_BALANCE_COLUMN;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request);
        List<MonthlyBalanceResult> results = statisticsQueryService.findMonthlyBalance(filter);

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());

        List<DataPoint> points = months.stream()
                .map(month -> new DataPoint(
                        month.toString(),
                        ProviderHelper.getAmount(results, month, MonthlyBalanceResult::totalAmount),
                        null))
                .toList();

        return new SeriesPayload(List.of(new SeriesItem("Balance", "column", null, points)));
    }
}
