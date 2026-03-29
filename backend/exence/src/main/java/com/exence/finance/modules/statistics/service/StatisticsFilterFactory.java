package com.exence.finance.modules.statistics.service;

import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class StatisticsFilterFactory {

    public StatisticsFilter fromRequest(WidgetRequest request) {
        return StatisticsFilter.builder()
                .startDate(request.startDate())
                .endDate(request.endDate())
                .categoryIds(extractCategoryIds(request.settings()))
                .build();
    }

    public StatisticsFilter fromRequest(WidgetRequest request, TransactionType type) {
        return StatisticsFilter.builder()
                .startDate(request.startDate())
                .endDate(request.endDate())
                .categoryIds(extractCategoryIds(request.settings()))
                .type(type)
                .build();
    }

    public StatisticsFilter forPeriod(LocalDate start, LocalDate end) {
        return StatisticsFilter.builder().startDate(start).endDate(end).build();
    }

    public StatisticsFilter forPeriod(LocalDate start, LocalDate end, TransactionType type) {
        return StatisticsFilter.builder()
                .startDate(start)
                .endDate(end)
                .type(type)
                .build();
    }

    private List<Long> extractCategoryIds(Map<WidgetSetting, Object> settings) {
        if (settings == null) {
            return Collections.emptyList();
        }
        Object value = settings.get(WidgetSetting.CATEGORY_IDS);
        if (!(value instanceof List<?> list) || list.isEmpty()) {
            return Collections.emptyList();
        }
        return list.stream()
                .filter(item -> item instanceof Number)
                .map(item -> ((Number) item).longValue())
                .toList();
    }
}
