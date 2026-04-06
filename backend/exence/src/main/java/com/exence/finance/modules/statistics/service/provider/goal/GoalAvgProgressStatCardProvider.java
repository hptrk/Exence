package com.exence.finance.modules.statistics.service.provider.goal;

import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class GoalAvgProgressStatCardProvider implements GoalWidgetDataProvider {

    private static final int DIVISION_SCALE = 4;
    private static final int PERCENTAGE_MULTIPLIER = 100;

    private final GoalRepository goalRepository;

    @Override
    public GoalWidgetType getSupportedType() {
        return GoalWidgetType.GOAL_AVG_PROGRESS_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        List<Goal> activeGoals = goalRepository.findByStatusIn(List.of(GoalStatus.ACTIVE));

        BigDecimal avgProgress = activeGoals.isEmpty()
                ? BigDecimal.ZERO
                : activeGoals.stream()
                        .map(g -> g.getCurrentAmount()
                                .divide(g.getTargetAmount(), DIVISION_SCALE, RoundingMode.HALF_UP)
                                .multiply(BigDecimal.valueOf(PERCENTAGE_MULTIPLIER)))
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                        .divide(BigDecimal.valueOf(activeGoals.size()), 2, RoundingMode.HALF_UP);

        return new StatCardPayload(avgProgress, "%", null, null, null, null, null);
    }
}
