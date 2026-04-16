package com.exence.finance.modules.category.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(title = "Category Get DTO", description = "Used for retrieving category details.")
public record CategoryGetDTO(
        @Schema(description = "Unique identifier of the category", example = "1") Long id,
        @Schema(description = "Name of the category.", example = "Groceries") String name,
        @Schema(description = "Icon representing the category.", example = "shopping_cart") MaterialIcon icon,
        @Schema(description = "Color of the category in hex format", example = "#4DB6AC") String color,
        @Schema(description = "Type of the category", example = "EXPENSE") CategoryType type,
        @Schema(description = "Additional notes about the category", example = "Used for all grocery shopping")
                String note,
        @Schema(description = "Current balance of the category", example = "29410.00") BigDecimal balance) {}
