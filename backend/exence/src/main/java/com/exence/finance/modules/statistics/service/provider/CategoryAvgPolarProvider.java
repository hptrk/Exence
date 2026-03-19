package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DistributionItem;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class CategoryAvgPolarProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.CATEGORY_AVG_POLAR;
    }

    @Override
    public DistributionPayload getData(WidgetRequest request) {
        List<DistributionItem> items =
                statisticsRepository
                        .findCategoryStatsAverage(request.startDate(), request.endDate(), TransactionType.EXPENSE)
                        .stream()
                        .map(r -> new DistributionItem(r.getCategoryName(), r.getAvgAmount(), r.getCategoryColor()))
                        .toList();

        return new DistributionPayload(items);
    }
}
