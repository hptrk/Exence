package com.exence.finance.modules.statistics.service.provider;

import static com.exence.finance.common.util.DateUtils.toDisplayDate;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class ExpenseTrendProvider implements WidgetDataProvider {

    private final I18nService i18n;
    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.EXPENSE_TREND;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request, TransactionType.EXPENSE);
        List<DataPoint> dataPoints = statisticsQueryService.findDailyTrendByType(filter).stream()
                .map(p -> new DataPoint(toDisplayDate(p.statDate()), p.totalAmount(), null))
                .toList();

        SeriesItem series = new SeriesItem(i18n.get("label.expense"), "area", null, dataPoints);
        return new SeriesPayload(List.of(series));
    }
}
