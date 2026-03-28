package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class IncomeFrequencyStatCardProvider implements WidgetDataProvider {

    private final ProviderHelper providerHelper;
    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.INCOME_FREQUENCY_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        StatisticsFilter currentFilter = filterFactory.fromRequest(request, TransactionType.INCOME);
        long currentCount = statisticsQueryService.countTransactionsByType(currentFilter);

        return providerHelper.buildFrequencyStatCard(
                request,
                currentCount,
                (s, e) -> statisticsQueryService.countTransactionsByType(
                        filterFactory.fromRequest(request.withDates(s, e), TransactionType.INCOME)));
    }
}
