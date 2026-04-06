package com.exence.finance.modules.statistics.service.provider.goal;

import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.entity.GoalProgressHistory;
import com.exence.finance.modules.goal.repository.GoalProgressRepository;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.ProviderHelper;
import com.exence.finance.modules.statistics.service.provider.TrendResult;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class GoalTotalSavedThisYearStatCardProvider implements GoalWidgetDataProvider {

    private final GoalRepository goalRepository;
    private final GoalProgressRepository goalProgressRepository;
    private final ProviderHelper providerHelper;

    @Override
    public GoalWidgetType getSupportedType() {
        return GoalWidgetType.GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        BigDecimal currentSaved = calculateTotalSaved(request.startDate(), request.endDate());
        TrendResult trend = providerHelper.computeTrendByDifference(request, currentSaved, this::calculateTotalSaved);

        return new StatCardPayload(
                currentSaved,
                providerHelper.getUserCurrencySymbol(),
                null,
                trend.changePercentage(),
                trend.trend(),
                null,
                null);
    }

    private BigDecimal calculateTotalSaved(LocalDate startDate, LocalDate endDate) {
        List<Goal> allGoals = goalRepository.findAllUserFiltered();

        if (allGoals.isEmpty()) {
            return BigDecimal.ZERO;
        }

        List<Long> goalIds = allGoals.stream().map(Goal::getId).toList();
        Instant periodStart = startDate.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant periodEnd = endDate.atTime(23, 59, 59).toInstant(ZoneOffset.UTC);

        List<GoalProgressHistory> periodRecords =
                goalProgressRepository.findAllInPeriodForGoals(goalIds, periodStart, periodEnd);

        BigDecimal totalSaved = BigDecimal.ZERO;
        for (Goal goal : allGoals) {
            BigDecimal amountAtStart = goalProgressRepository
                    .findLastBeforeInstant(goal.getId(), periodStart)
                    .map(GoalProgressHistory::getAmount)
                    .orElse(BigDecimal.ZERO);

            BigDecimal amountAtEnd = periodRecords.stream()
                    .filter(h -> h.getGoal().getId().equals(goal.getId()))
                    .map(GoalProgressHistory::getAmount)
                    .reduce((first, second) -> second)
                    .orElse(null);

            if (amountAtEnd != null && amountAtEnd.compareTo(amountAtStart) > 0) {
                BigDecimal gain = amountAtEnd.subtract(amountAtStart);
                // convert to base currency using goal's current base/native ratio
                if (goal.getCurrentAmount().compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal conversionRate = goal.getCurrentBaseCurrencyAmount()
                            .divide(goal.getCurrentAmount(), 10, RoundingMode.HALF_UP);
                    totalSaved = totalSaved.add(gain.multiply(conversionRate));
                } else {
                    totalSaved = totalSaved.add(gain);
                }
            }
        }

        return totalSaved.setScale(2, RoundingMode.HALF_UP);
    }
}
