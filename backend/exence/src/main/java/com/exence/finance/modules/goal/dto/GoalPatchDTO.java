package com.exence.finance.modules.goal.dto;

import static com.exence.finance.common.util.ValidationConstants.GOAL_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.GOAL_CURRENT_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.GOAL_DESCRIPTION_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.GOAL_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.GOAL_TITLE_MIN_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;

import com.exence.finance.modules.goal.enums.GoalStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(
        title = "Goal Patch DTO",
        description = "Used for updating an existing financial goal. All fields are optional, but at least one must be"
                + " provided.")
public record GoalPatchDTO(
        @Schema(description = "Title of the goal. Must be between 1 and 100 characters.", example = "Vacation Fund")
                @Size(
                        min = GOAL_TITLE_MIN_LENGTH,
                        max = GOAL_TITLE_MAX_LENGTH,
                        message = "{validation.goal.title.size}")
                String title,
        @Schema(
                        description = "Description of the goal. Must be less than 500 characters.",
                        example = "Saving for a trip to Hawaii")
                @Size(max = GOAL_DESCRIPTION_MAX_LENGTH, message = "{validation.goal.description.size}")
                String description,
        @Schema(
                        description =
                                "Target amount for the goal. Must be a positive number with up to 10 integer digits and 2"
                                        + " decimal places.",
                        example = "3000.00")
                @DecimalMin(value = GOAL_AMOUNT_MIN, message = "{validation.goal.target-amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.goal.target-amount.digits}")
                BigDecimal targetAmount,
        @Schema(
                        description =
                                "Current amount saved towards the goal. Must be a non-negative number with up to 10 integer"
                                        + " digits and 2 decimal places.",
                        example = "1000.00")
                @DecimalMin(value = GOAL_CURRENT_AMOUNT_MIN, message = "{validation.goal.current-amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.goal.current-amount.digits}")
                BigDecimal currentAmount,
        @Schema(description = "Deadline for achieving the goal.", example = "2026-12-31") LocalDate deadline,
        @Schema(description = "Status of the goal.", example = "PAUSED") GoalStatus status,
        @Schema(description = "Identifier of the category associated with the goal.", example = "2") Long categoryId) {}
