package com.exence.finance.modules.statistics.dto.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(title = "Distribution Item DTO", description = "Represents a single item in a distribution chart.")
public record DistributionItem(
        @Schema(description = "The name of the distribution item, for example a category name.", example = "Groceries")
                String name,
        @Schema(
                        description = "The numerical value representing the amount for this distribution item.",
                        example = "15000.00")
                BigDecimal amount,
        @Schema(
                        description =
                                "The color associated with this distribution item. This can be used to differentiate between"
                                        + " for example different categories.",
                        example = "#4DB6AC")
                String color) {}
