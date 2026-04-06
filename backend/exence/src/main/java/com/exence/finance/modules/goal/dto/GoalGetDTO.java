package com.exence.finance.modules.goal.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.goal.enums.GoalStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalGetDTO(
        Long id,
        String title,
        String description,
        BigDecimal targetAmount,
        BigDecimal currentAmount,
        BigDecimal targetBaseCurrencyAmount,
        BigDecimal currentBaseCurrencyAmount,
        SupportedCurrency currency,
        LocalDate deadline,
        GoalStatus status,
        Long categoryId,
        BigDecimal progressPercentage) {}
