package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.SlopeItem;
import com.exence.finance.modules.statistics.dto.payload.SlopePayload;
import com.exence.finance.modules.statistics.dto.projection.YearlyCategoryProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
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

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.YEARLY_SLOPE;
    }

    @Override
    public SlopePayload getData(WidgetRequest request) {
        List<YearlyCategoryProjection> results = statisticsRepository.findYearlyCategoryTotals(
                request.startDate(), request.endDate(), TransactionType.EXPENSE);

        Map<String, SlopeEntry> categoryMap = new LinkedHashMap<>();
        TreeSet<String> allYears = new TreeSet<>();

        for (YearlyCategoryProjection p : results) {
            String year = String.valueOf(p.getStatYear());
            allYears.add(year);
            SlopeEntry entry =
                    categoryMap.computeIfAbsent(p.getCategoryName(), k -> new SlopeEntry(p.getCategoryColor()));
            entry.yearsData.put(year, p.getTotalAmount());
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
