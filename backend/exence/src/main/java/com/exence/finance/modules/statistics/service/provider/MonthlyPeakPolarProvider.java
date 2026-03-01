package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DistributionItem;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.dto.projection.MonthlyBalanceProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class MonthlyPeakPolarProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.MONTHLY_PEAK_POLAR;
    }

    @Override
    public DistributionPayload getData(WidgetRequest request) {
        List<MonthlyBalanceProjection> results = statisticsRepository.findMonthlyPeakByType(
                request.startDate(), request.endDate(), TransactionType.EXPENSE);

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());

        List<DistributionItem> items = months.stream()
                .map(month -> new DistributionItem(
                        month.toString(),
                        ProviderHelper.getAmount(results, month, MonthlyBalanceProjection::getTotalAmount),
                        null))
                .toList();

        return new DistributionPayload(items);
    }
}
