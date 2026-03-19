package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.dto.projection.CategoryAmountProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class SpendingRadarProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.SPENDING_RADAR;
    }

    @Override
    public DistributionPayload getData(WidgetRequest request) {
        List<CategoryAmountProjection> results = statisticsRepository.findCategoryStatsAmount(
                request.startDate(), request.endDate(), TransactionType.EXPENSE);

        return ProviderHelper.buildCategoryAmountDistributionPayload(results);
    }
}
