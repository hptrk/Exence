package com.exence.finance.modules.goal.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.goal.enums.GoalStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(
        title = "Goal Get DTO",
        description = "Used for retrieving goal information. Contains all details about a financial goal.")
public record GoalGetDTO(
        @Schema(description = "Unique identifier of the goal.", example = "1") Long id,
        @Schema(description = "Title of the goal.", example = "Vacation Fund") String title,
        @Schema(description = "Description of the goal.", example = "Saving for a trip to Hawaii") String description,
        @Schema(description = "Target amount for the goal.", example = "3000.00") BigDecimal targetAmount,
        @Schema(description = "Current amount saved towards the goal.", example = "1000.00") BigDecimal currentAmount,
        @Schema(description = "Target amount converted to the workspace's base currency.", example = "1200000.00")
                BigDecimal targetBaseCurrencyAmount,
        @Schema(
                        description =
                                "Current amount saved towards the goal, converted to the workspace's base currency.",
                        example = "400000.00")
                BigDecimal currentBaseCurrencyAmount,
        @Schema(description = "Currency of the goal.", example = "USD") SupportedCurrency currency,
        @Schema(description = "Deadline for achieving the goal.", example = "2026-12-31") LocalDate deadline,
        @Schema(description = "Status of the goal.", example = "PAUSED") GoalStatus status,
        @Schema(description = "ID of the category associated with the goal.", example = "2") Long categoryId,
        @Schema(description = "Progress percentage towards achieving the goal.", example = "33.33")
                BigDecimal progressPercentage) {}
