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
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class MonthlyBalanceColumnProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.MONTHLY_BALANCE_COLUMN;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        List<MonthlyBalanceProjection> results =
                statisticsRepository.findMonthlyBalance(request.startDate(), request.endDate());

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());

        List<DataPoint> points = months.stream()
                .map(month -> new DataPoint(
                        month.toString(),
                        ProviderHelper.getAmount(results, month, MonthlyBalanceProjection::getTotalAmount),
                        null))
                .toList();

        return new SeriesPayload(List.of(new SeriesItem("Balance", "column", null, points)));
    }
}
