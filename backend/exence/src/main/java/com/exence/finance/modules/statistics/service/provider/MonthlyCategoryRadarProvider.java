package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.projection.MonthlyCategoryProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.time.YearMonth;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class MonthlyCategoryRadarProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.MONTHLY_CATEGORY_RADAR;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        List<MonthlyCategoryProjection> results = statisticsRepository.findMonthlyCategoryTotals(
                request.startDate(), request.endDate(), TransactionType.EXPENSE);

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());
        Set<String> categories = ProviderHelper.getCategories(results);

        List<SeriesItem> series = months.stream()
                .map(month -> {
                    List<DataPoint> points = categories.stream()
                            .map(category -> new DataPoint(
                                    category, ProviderHelper.getCategoryAmountForMonth(results, category, month), null))
                            .toList();
                    return new SeriesItem(month.toString(), null, null, points);
                })
                .toList();

        return new SeriesPayload(series);
    }
}
