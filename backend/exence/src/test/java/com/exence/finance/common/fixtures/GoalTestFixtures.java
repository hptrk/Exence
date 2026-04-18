package com.exence.finance.common.fixtures;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.enums.GoalStatus;
import java.math.BigDecimal;

public final class GoalTestFixtures {

    private GoalTestFixtures() {}

    public static GoalCreateDTO goalCreateDto(BigDecimal targetAmount, BigDecimal initialAmount) {
        return new GoalCreateDTO("Savings goal", null, targetAmount, initialAmount, SupportedCurrency.EUR, null, 1L);
    }

    public static Goal mappedGoal(GoalCreateDTO dto) {
        return Goal.builder()
                .id(1L)
                .title(dto.title())
                .targetAmount(dto.targetAmount())
                .currency(dto.currency())
                .category(CategoryTestFixtures.expenseCategory())
                .build();
    }

    public static Goal activeGoal(BigDecimal targetAmount, BigDecimal currentAmount) {
        return Goal.builder()
                .id(1L)
                .targetAmount(targetAmount)
                .currentAmount(currentAmount)
                .currency(SupportedCurrency.EUR)
                .status(GoalStatus.ACTIVE)
                .category(CategoryTestFixtures.expenseCategory())
                .build();
    }
}
