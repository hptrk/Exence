package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.BubblePayload;
import com.exence.finance.modules.statistics.dto.payload.BubblePoint;
import com.exence.finance.modules.statistics.dto.payload.BubbleSeries;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class CategoryBubbleProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.CATEGORY_BUBBLE;
    }

    @Override
    public BubblePayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request, TransactionType.EXPENSE);

        List<BubbleSeries> allSeries = statisticsQueryService.findCategoryStatsAmountCountAverage(filter).stream()
                .map(result -> {
                    BubblePoint point = new BubblePoint(
                            result.transactionCount().intValue(), result.avgAmount(), result.totalAmount());
                    return new BubbleSeries(result.categoryName(), List.of(point), result.categoryColor());
                })
                .toList();

        return new BubblePayload(allSeries);
    }
}
