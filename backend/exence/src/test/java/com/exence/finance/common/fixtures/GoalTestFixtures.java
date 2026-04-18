package com.exence.finance.common.fixtures;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.dto.GoalGetDTO;
import com.exence.finance.modules.goal.dto.GoalPatchDTO;
import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.enums.GoalStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

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

    public static GoalCreateDTO createRequest(Long categoryId) {
        return new GoalCreateDTO(
                "Vacation Fund",
                "Saving for Hawaii",
                new BigDecimal("3000.00"),
                new BigDecimal("500.00"),
                SupportedCurrency.USD,
                LocalDate.of(2026, 12, 31),
                categoryId);
    }

    public static GoalPatchDTO patchRequest() {
        return new GoalPatchDTO("Updated Fund", null, new BigDecimal("4000.00"), null, null, null, null);
    }

    public static GoalGetDTO getDTO(Long categoryId) {
        return new GoalGetDTO(
                1L,
                "Vacation Fund",
                "Saving for Hawaii",
                new BigDecimal("3000.00"),
                new BigDecimal("500.00"),
                new BigDecimal("3000.00"),
                new BigDecimal("500.00"),
                SupportedCurrency.USD,
                LocalDate.of(2026, 12, 31),
                GoalStatus.ACTIVE,
                categoryId,
                new BigDecimal("16.67"));
    }
}
