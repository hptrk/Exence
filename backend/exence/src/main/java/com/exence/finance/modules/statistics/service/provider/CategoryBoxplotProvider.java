package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.BoxplotPayload;
import com.exence.finance.modules.statistics.dto.payload.BoxplotPoint;
import com.exence.finance.modules.statistics.dto.result.CategoryBoxplotResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class CategoryBoxplotProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.CATEGORY_BOXPLOT;
    }

    @Override
    public BoxplotPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request);
        List<CategoryBoxplotResult> results = statisticsQueryService.findBoxplotByExpenseCategory(filter);

        List<BoxplotPoint> points = results.stream()
                .map(row -> new BoxplotPoint(
                        row.name(), List.of(row.min(), row.q1(), row.median(), row.q3(), row.max()), row.color()))
                .toList();

        return new BoxplotPayload(getSupportedType(), points);
    }
}
