package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.DistributionItem;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class CategoryAvgPolarProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public StatisticsWidgetType getSupportedType() {
        return StatisticsWidgetType.CATEGORY_AVG_POLAR;
    }

    @Override
    public DistributionPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request, TransactionType.EXPENSE);
        List<DistributionItem> items = statisticsQueryService.findCategoryStatsAverage(filter).stream()
                .map(r -> new DistributionItem(r.categoryName(), r.avgAmount(), r.categoryColor()))
                .toList();

        return new DistributionPayload(getSupportedType(), items);
    }
}
