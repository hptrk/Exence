package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.GaugePayload;
import com.exence.finance.modules.statistics.dto.projection.TypeAmountProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class SavingsGaugeProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.SAVINGS_RATE_GAUGE;
    }

    @Override
    public GaugePayload getData(WidgetRequest request) {
        Map<TransactionType, BigDecimal> sums =
                statisticsRepository.sumByType(request.startDate(), request.endDate()).stream()
                        .collect(Collectors.toMap(TypeAmountProjection::getType, TypeAmountProjection::getTotalAmount));

        BigDecimal income = sums.getOrDefault(TransactionType.INCOME, BigDecimal.ZERO);
        BigDecimal expense = sums.getOrDefault(TransactionType.EXPENSE, BigDecimal.ZERO);

        BigDecimal savingsRate = ProviderHelper.calculateSavingsRate(income, expense);
        return new GaugePayload(savingsRate);
    }
}
