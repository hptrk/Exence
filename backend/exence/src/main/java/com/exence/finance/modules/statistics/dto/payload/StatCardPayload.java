package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(
        title = "StatCard Payload DTO",
        description =
                "Payload for stat card widgets, containing all necessary information to display a single statistic.")
public record StatCardPayload(
        @Schema(example = "TOP_EXPENSE_TRANSACTION_STATCARD") WidgetType type,
        @Schema(
                        description = "The main value to display on the stat card, such as total expenses or income.",
                        example = "235000.00")
                BigDecimal value,
        @Schema(description = "The unit of the value, such as 'USD', 'transactions', or 'days'.", example = "Ft")
                String unit,
        @Schema(
                        description =
                                "A descriptive label providing context for the statistic, such as 'Total Expenses' or 'No"
                                        + " Spend Days'.",
                        example = "Top Expense Transaction")
                String contextLabel,
        @Schema(
                        description = "The percentage change compared to a previous period, used to indicate trends.",
                        example = "15.5")
                BigDecimal changePercentage,
        @Schema(
                        description =
                                "The trend direction based on the change percentage, indicating whether the value has"
                                        + " increased, decreased, or remained neutral compared to the previous period.",
                        example = "UP")
                Trend trend,
        @Schema(description = "An optional icon name that visually represents the statistic.", example = "money_off")
                String icon,
        @Schema(
                        description =
                                "The color of the icon, which can be used to visually indicate the nature or the category of"
                                        + " the statistic.",
                        example = "#E55353")
                String iconColor)
        implements WidgetDataPayload {}
