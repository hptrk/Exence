package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.SlopeItem;
import com.exence.finance.modules.statistics.dto.payload.SlopePayload;
import com.exence.finance.modules.statistics.dto.result.YearlyCategoryResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class YearlySlopeProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.YEARLY_SLOPE;
    }

    @Override
    public SlopePayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request, TransactionType.EXPENSE);
        List<YearlyCategoryResult> results = statisticsQueryService.findYearlyCategoryTotals(filter);

        Map<String, SlopeEntry> categoryMap = new LinkedHashMap<>();
        TreeSet<String> allYears = new TreeSet<>();

        for (YearlyCategoryResult p : results) {
            String year = String.valueOf(p.statYear());
            allYears.add(year);
            SlopeEntry entry = categoryMap.computeIfAbsent(p.categoryName(), k -> new SlopeEntry(p.categoryColor()));
            entry.yearsData.put(year, p.totalAmount());
        }

        List<SlopeItem> items = categoryMap.entrySet().stream()
                .map(e -> {
                    Map<String, BigDecimal> filled = new LinkedHashMap<>();
                    for (String year : allYears) {
                        filled.put(year, e.getValue().yearsData.getOrDefault(year, BigDecimal.ZERO));
                    }
                    return new SlopeItem(e.getKey(), filled, e.getValue().color);
                })
                .toList();

        return new SlopePayload(items);
    }

    private static final class SlopeEntry {
        private final String color;
        private final Map<String, BigDecimal> yearsData = new LinkedHashMap<>();

        SlopeEntry(String color) {
            this.color = color;
        }
    }
}
