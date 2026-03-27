package com.exence.finance.modules.category.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(title = "Category Summary Response DTO", description = "Summary of a category, with its total amount")
public record CategorySummaryResponse(
    @Schema(description = "Unique identifier of the category", example = "1")
    Long id,

    @Schema(description = "Name of the category", example = "Groceries")
    String name,

    @Schema(
        description = "Icon representing the category. It can only be chosen from a certain predefined selection.",
        example = "shopping_cart")
    String icon,

    @Schema(description = "Color of the category in hex format", example = "#4DB6AC")
    String color,

    @Schema(description = "The total amount of transactions associated with this category", example = "193075.00")
    BigDecimal totalAmount) {}
