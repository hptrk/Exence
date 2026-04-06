package com.exence.finance.modules.statistics.service.provider.goal;

import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import java.math.BigDecimal;
import java.math.RoundingMode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class GoalCompletionRateStatCardProvider implements GoalWidgetDataProvider {

    private final GoalRepository goalRepository;

    @Override
    public GoalWidgetType getSupportedType() {
        return GoalWidgetType.GOAL_COMPLETION_RATE_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        long completed = goalRepository.countByStatus(GoalStatus.COMPLETED);
        long total = goalRepository.countAll();

        BigDecimal rate = total == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(completed)
                        .divide(BigDecimal.valueOf(total), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(2, RoundingMode.HALF_UP);

        return new StatCardPayload(rate, "%", null, null, null, null, null);
    }
}
