package com.exence.finance.modules.category.dto;

import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MIN_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NOTE_MAX_LENGTH;

import com.exence.finance.common.annotations.ValidColor;
import jakarta.validation.constraints.Size;

public record CategoryPatchDTO(
        @Size(
                        min = CATEGORY_NAME_MIN_LENGTH,
                        max = CATEGORY_NAME_MAX_LENGTH,
                        message = "{validation.category.name.size}")
                String name,
        MaterialIcon icon,
        @ValidColor(allowNull = true) String color,
        CategoryType type,
        @Size(max = CATEGORY_NOTE_MAX_LENGTH, message = "{validation.category.note.size}") String note) {}
