package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.DistributionItem;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.dto.result.MonthlyBalanceResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class MonthlyPeakPolarProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;
    private final ProviderHelper providerHelper;

    @Override
    public StatisticsWidgetType getSupportedType() {
        return StatisticsWidgetType.MONTHLY_PEAK_POLAR;
    }

    @Override
    public DistributionPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request, TransactionType.EXPENSE);
        List<MonthlyBalanceResult> results = statisticsQueryService.findMonthlyPeakByType(filter);

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());

        List<DistributionItem> items = months.stream()
                .map(month -> new DistributionItem(
                        month.toString(),
                        providerHelper.getAmount(results, month, MonthlyBalanceResult::totalAmount),
                        null))
                .toList();

        return new DistributionPayload(getSupportedType(), items);
    }
}
