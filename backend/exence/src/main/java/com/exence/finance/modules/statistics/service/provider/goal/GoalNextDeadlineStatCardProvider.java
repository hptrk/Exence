package com.exence.finance.modules.statistics.service.provider.goal;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class GoalNextDeadlineStatCardProvider implements GoalWidgetDataProvider {

    private final GoalRepository goalRepository;
    private final I18nService i18n;

    @Override
    public GoalWidgetType getSupportedType() {
        return GoalWidgetType.GOAL_NEXT_DEADLINE_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        Optional<Goal> nextGoal = goalRepository.findNextDeadlineGoal(GoalStatus.ACTIVE, LocalDate.now());

        if (nextGoal.isEmpty()) {
            return new StatCardPayload(
                    getSupportedType(),
                    null,
                    i18n.get("unit.days"),
                    i18n.get("context.no-deadline"),
                    null,
                    null,
                    null,
                    null);
        }

        Goal goal = nextGoal.get();
        long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), goal.getDeadline());
        String unitLabel = i18n.getUnitLabel(daysLeft, "unit.day", "unit.days");

        return new StatCardPayload(
                getSupportedType(), BigDecimal.valueOf(daysLeft), unitLabel, goal.getTitle(), null, null, null, null);
    }
}
