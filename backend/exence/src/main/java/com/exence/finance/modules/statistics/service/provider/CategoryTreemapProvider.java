package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.CategoryFlowResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class CategoryTreemapProvider implements WidgetDataProvider {

    private final I18nService i18n;
    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.CATEGORY_TREEMAP;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request);
        List<CategoryFlowResult> results = statisticsQueryService.findCategoryTotalsGroupedByType(filter);

        Map<TransactionType, List<CategoryFlowResult>> byType =
                results.stream().collect(Collectors.groupingBy(CategoryFlowResult::type));

        List<SeriesItem> series = List.of(
                toSeriesItem(i18n.get("label.expense"), byType.getOrDefault(TransactionType.EXPENSE, List.of())),
                toSeriesItem(i18n.get("label.income"), byType.getOrDefault(TransactionType.INCOME, List.of())));

        return new SeriesPayload(getSupportedType(), series);
    }

    private SeriesItem toSeriesItem(String name, List<CategoryFlowResult> data) {
        List<DataPoint> points = data.stream()
                .map(r -> new DataPoint(r.categoryName(), r.totalAmount(), r.categoryColor()))
                .toList();
        return new SeriesItem(name, null, null, points);
    }
}
