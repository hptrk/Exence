package com.exence.finance.modules.category.dto;

import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MIN_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NOTE_MAX_LENGTH;

import com.exence.finance.common.annotations.ValidColor;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(
        title = "Category Patch DTO",
        description = "Data required to update an existing category. All fields are optional, but at least one must be"
                + " provided.")
public record CategoryPatchDTO(
        @Schema(
                        description = "Name of the category. It must be between 3 and 50 characters long.",
                        example = "Groceries")
                @Size(
                        min = CATEGORY_NAME_MIN_LENGTH,
                        max = CATEGORY_NAME_MAX_LENGTH,
                        message = "{validation.category.name.size}")
                String name,
        @Schema(
                        description =
                                "Icon representing the category. It can only be chosen from a certain predefined selection.",
                        example = "shopping_cart")
                MaterialIcon icon,
        @Schema(description = "Color of the category in hex format", example = "#4DB6AC") @ValidColor(allowNull = true)
                String color,
        @Schema(description = "Type of the category", example = "EXPENSE") CategoryType type,
        @Schema(description = "Additional notes about the category", example = "Used for all grocery shopping")
                @Size(max = CATEGORY_NOTE_MAX_LENGTH, message = "{validation.category.note.size}")
                String note) {}
