package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.GaugePayload;
import com.exence.finance.modules.statistics.dto.result.TypeAmountResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class SavingsGaugeProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;
    private final ProviderHelper providerHelper;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.SAVINGS_RATE_GAUGE;
    }

    @Override
    public GaugePayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request);

        Map<TransactionType, BigDecimal> sums = statisticsQueryService.sumByType(filter).stream()
                .collect(Collectors.toMap(TypeAmountResult::type, TypeAmountResult::totalAmount));

        BigDecimal income = sums.getOrDefault(TransactionType.INCOME, BigDecimal.ZERO);
        BigDecimal expense = sums.getOrDefault(TransactionType.EXPENSE, BigDecimal.ZERO);

        BigDecimal savingsRate = providerHelper.calculateSavingsRate(income, expense);
        return new GaugePayload(getSupportedType(), savingsRate);
    }
}
