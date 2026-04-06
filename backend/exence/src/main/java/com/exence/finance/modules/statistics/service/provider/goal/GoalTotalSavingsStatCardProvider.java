package com.exence.finance.modules.statistics.service.provider.goal;

import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.ProviderHelper;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class GoalTotalSavingsStatCardProvider implements GoalWidgetDataProvider {

    private final GoalRepository goalRepository;
    private final ProviderHelper providerHelper;

    @Override
    public GoalWidgetType getSupportedType() {
        return GoalWidgetType.GOAL_TOTAL_SAVINGS_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        BigDecimal total = goalRepository.sumCurrentBaseCurrencyAmount();
        return new StatCardPayload(total, providerHelper.getUserCurrencySymbol(), null, null, null, null, null);
    }
}
