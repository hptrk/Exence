package com.exence.finance.modules.goal.dto;

import static com.exence.finance.common.util.ValidationConstants.GOAL_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.GOAL_CURRENT_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.GOAL_DESCRIPTION_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.GOAL_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.GOAL_TITLE_MIN_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;

import com.exence.finance.modules.goal.enums.GoalStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalPatchDTO(
        @Size(min = GOAL_TITLE_MIN_LENGTH, max = GOAL_TITLE_MAX_LENGTH, message = "{validation.goal.title.size}")
                String title,
        @Size(max = GOAL_DESCRIPTION_MAX_LENGTH, message = "{validation.goal.description.size}") String description,
        @DecimalMin(value = GOAL_AMOUNT_MIN, message = "{validation.goal.target-amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.goal.target-amount.digits}")
                BigDecimal targetAmount,
        @DecimalMin(value = GOAL_CURRENT_AMOUNT_MIN, message = "{validation.goal.current-amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.goal.current-amount.digits}")
                BigDecimal currentAmount,
        LocalDate deadline,
        GoalStatus status,
        Long categoryId) {}
