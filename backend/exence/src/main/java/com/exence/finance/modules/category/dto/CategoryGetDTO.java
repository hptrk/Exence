package com.exence.finance.modules.category.dto;

import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MIN_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NOTE_MAX_LENGTH;

import com.exence.finance.common.annotations.ValidColor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CategoryGetDTO(
        Long id,
        @NotBlank(message = "{validation.category.name.not-blank}")
                @Size(
                        min = CATEGORY_NAME_MIN_LENGTH,
                        max = CATEGORY_NAME_MAX_LENGTH,
                        message = "{validation.category.name.size}")
                String name,
        @NotNull(message = "{validation.category.icon.not-null}") MaterialIcon icon,
        @ValidColor String color,
        @NotNull(message = "{validation.category.type.not-null}") CategoryType type,
        @Size(max = CATEGORY_NOTE_MAX_LENGTH, message = "{validation.category.note.size}") String note) {}
