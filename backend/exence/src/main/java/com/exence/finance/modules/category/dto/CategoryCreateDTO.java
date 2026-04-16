package com.exence.finance.modules.category.dto;

import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MIN_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NOTE_MAX_LENGTH;

import com.exence.finance.common.annotations.ValidColor;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(title = "Category Create DTO", description = "Data required to create a new category.")
public record CategoryCreateDTO(
        @Schema(
                        description = "Name of the category. It must be between 3 and 50 characters long.",
                        example = "Groceries")
                @NotBlank(message = "{validation.category.name.not-blank}")
                @Size(
                        min = CATEGORY_NAME_MIN_LENGTH,
                        max = CATEGORY_NAME_MAX_LENGTH,
                        message = "{validation.category.name.size}")
                String name,
        @Schema(
                        description =
                                "Icon representing the category. It can only be chosen from a certain predefined selection.",
                        example = "shopping_cart")
                @NotNull(message = "{validation.category.icon.not-null}")
                MaterialIcon icon,
        @Schema(description = "Color of the category in hex format", example = "#4DB6AC") @ValidColor String color,
        @Schema(description = "Type of the category", example = "EXPENSE")
                @NotNull(message = "{validation.category.type.not-null}")
                CategoryType type,
        @Schema(description = "Additional notes about the category", example = "Used for all grocery shopping")
                @Size(max = CATEGORY_NOTE_MAX_LENGTH, message = "{validation.category.note.size}")
                String note) {}
