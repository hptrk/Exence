package com.exence.finance.modules.statistics.service.provider.goal;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.entity.GoalProgressHistory;
import com.exence.finance.modules.goal.repository.GoalProgressRepository;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class GoalProgressTrendProvider implements GoalWidgetDataProvider {

    private final GoalRepository goalRepository;
    private final GoalProgressRepository goalProgressRepository;

    @Override
    public GoalWidgetType getSupportedType() {
        return GoalWidgetType.GOAL_PROGRESS_TREND;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        Long goalId = extractGoalId(request);
        Goal goal = goalRepository.find(goalId).orElseThrow(() -> new ExenceException(ErrorCode.GOAL_NOT_FOUND));

        List<GoalProgressHistory> history = goalProgressRepository.findByGoalIdOrderByRecordedAt(goalId);

        YearMonth startMonth =
                YearMonth.from(goal.getCreatedAt().atZone(ZoneOffset.UTC).toLocalDate());
        YearMonth endMonth = YearMonth.now();

        List<DataPoint> dataPoints = new ArrayList<>();
        BigDecimal lastKnownAmount = BigDecimal.ZERO;

        YearMonth current = startMonth;
        while (!current.isAfter(endMonth)) {
            YearMonth month = current;
            Instant monthEnd = month.atEndOfMonth().atTime(23, 59, 59).toInstant(ZoneOffset.UTC);

            BigDecimal amountForMonth = history.stream()
                    .filter(h -> !h.getRecordedAt().isAfter(monthEnd))
                    .map(GoalProgressHistory::getAmount)
                    .reduce((first, second) -> second)
                    .orElse(null);

            if (amountForMonth != null) {
                lastKnownAmount = amountForMonth;
            }

            dataPoints.add(new DataPoint(month.toString(), lastKnownAmount, null));
            current = current.plusMonths(1);
        }

        String categoryColor = goal.getCategory().getColor();
        SeriesItem series = new SeriesItem(goal.getTitle(), "line", categoryColor, dataPoints);
        return new SeriesPayload(List.of(series));
    }

    private Long extractGoalId(WidgetRequest request) {
        if (request.settings() == null) {
            throw new ExenceException(ErrorCode.INVALID_GOAL_SETTING, "goal-id-not-number");
        }
        Object value = request.settings().get(WidgetSetting.GOAL_ID);
        if (!(value instanceof Number)) {
            throw new ExenceException(ErrorCode.INVALID_GOAL_SETTING, "goal-id-not-number");
        }
        return ((Number) value).longValue();
    }
}
