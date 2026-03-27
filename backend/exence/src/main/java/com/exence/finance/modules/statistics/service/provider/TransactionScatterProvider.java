package com.exence.finance.modules.statistics.service.provider;

import static com.exence.finance.common.util.DateUtils.toDisplayDate;

import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.ScatterResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class TransactionScatterProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;
    private final ProviderHelper providerHelper;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.TRANSACTION_SCATTER;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request, TransactionType.EXPENSE);
        List<ScatterResult> results = statisticsQueryService.findScatterData(filter);

        Map<String, String> categoryColorMap = providerHelper.getCategoryColorMap(results);

        Map<String, List<DataPoint>> categoryPoints = new LinkedHashMap<>();
        categoryColorMap.keySet().forEach(cat -> categoryPoints.put(cat, new ArrayList<>()));

        for (ScatterResult p : results) {
            categoryPoints
                    .get(p.categoryName())
                    .add(new DataPoint(toDisplayDate(p.transactionDate()), p.amount(), null));
        }

        List<SeriesItem> series = categoryPoints.entrySet().stream()
                .map(e -> new SeriesItem(e.getKey(), null, categoryColorMap.get(e.getKey()), e.getValue()))
                .toList();

        return new SeriesPayload(getSupportedType(), series);
    }
}
