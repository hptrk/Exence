package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.BubblePayload;
import com.exence.finance.modules.statistics.dto.payload.BubblePoint;
import com.exence.finance.modules.statistics.dto.payload.BubbleSeries;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class CategoryBubbleProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.CATEGORY_BUBBLE;
    }

    @Override
    public BubblePayload getData(WidgetRequest request) {
        List<BubbleSeries> allSeries = statisticsRepository
                .findCategoryStatsAmountCountAverage(request.startDate(), request.endDate(), TransactionType.EXPENSE)
                .stream()
                .map(result -> {
                    BubblePoint point = new BubblePoint(
                            result.getTransactionCount().intValue(), result.getAvgAmount(), result.getTotalAmount());
                    return new BubbleSeries(result.getCategoryName(), List.of(point), result.getCategoryColor());
                })
                .toList();

        return new BubblePayload(allSeries);
    }
}
