package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.projection.CategoryFlowProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class CategoryTreemapProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.CATEGORY_TREEMAP;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        List<CategoryFlowProjection> results =
                statisticsRepository.findCategoryTotalsGroupedByType(request.startDate(), request.endDate());

        Map<TransactionType, List<CategoryFlowProjection>> byType =
                results.stream().collect(Collectors.groupingBy(CategoryFlowProjection::getType));

        List<SeriesItem> series = List.of(
                toSeriesItem("Expense", byType.getOrDefault(TransactionType.EXPENSE, List.of())),
                toSeriesItem("Income", byType.getOrDefault(TransactionType.INCOME, List.of())));

        return new SeriesPayload(series);
    }

    private SeriesItem toSeriesItem(String name, List<CategoryFlowProjection> data) {
        List<DataPoint> points = data.stream()
                .map(r -> new DataPoint(r.getCategoryName(), r.getTotalAmount(), r.getCategoryColor()))
                .toList();
        return new SeriesItem(name, null, null, points);
    }
}
