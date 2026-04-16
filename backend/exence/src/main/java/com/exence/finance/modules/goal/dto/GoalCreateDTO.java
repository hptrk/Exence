package com.exence.finance.modules.goal.dto;

import static com.exence.finance.common.util.ValidationConstants.GOAL_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.GOAL_CURRENT_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.GOAL_DESCRIPTION_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.GOAL_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.GOAL_TITLE_MIN_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;

import com.exence.finance.common.dto.SupportedCurrency;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(title = "Goal Create DTO", description = "Used for creating a new financial goal.")
public record GoalCreateDTO(
        @Schema(description = "Title of the goal. Must be between 1 and 100 characters.", example = "Vacation Fund")
                @NotBlank(message = "{validation.goal.title.not-blank}")
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
                @NotNull(message = "{validation.goal.target-amount.not-null}")
                @DecimalMin(value = GOAL_AMOUNT_MIN, message = "{validation.goal.target-amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.goal.target-amount.digits}")
                BigDecimal targetAmount,
        @Schema(
                        description =
                                "Initial amount saved towards the goal. Must be a non-negative number with up to 10 integer"
                                        + " digits and 2 decimal places.",
                        example = "500.00")
                @DecimalMin(value = GOAL_CURRENT_AMOUNT_MIN, message = "{validation.goal.current-amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.goal.current-amount.digits}")
                BigDecimal initialAmount,
        @Schema(description = "Currency for the goal. Must be a valid currency code.", example = "USD")
                @NotNull(message = "{validation.goal.currency.not-null}")
                SupportedCurrency currency,
        @Schema(description = "Deadline for achieving the goal. Must be a valid date format.", example = "2026-12-31")
                LocalDate deadline,
        @Schema(
                        description = "ID of the category to which the goal belongs. Must be a valid category ID.",
                        example = "1")
                @NotNull(message = "{validation.goal.category.not-null}")
                Long categoryId) {}
