package com.exence.finance.modules.category.dto;

import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MIN_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NOTE_MAX_LENGTH;

import com.exence.finance.common.annotations.ValidColor;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(
        callSuper = false,
        exclude = {})
@ToString(
        callSuper = true,
        exclude = {})
@JsonIdentityInfo(
        generator = com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = CategoryDTO.class)
public class CategoryDTO {
    private Long id;

    @NotBlank(message = "{validation.category.name.not-blank}")
    @Size(min = CATEGORY_NAME_MIN_LENGTH, max = CATEGORY_NAME_MAX_LENGTH, message = "{validation.category.name.size}")
    private String name;

    @NotNull(message = "{validation.category.icon.not-null}")
    private MaterialIcon icon;

    @ValidColor
    private String color;

    @NotNull(message = "{validation.category.type.not-null}")
    private CategoryType type;

    @Size(max = CATEGORY_NOTE_MAX_LENGTH, message = "{validation.category.note.size}")
    private String note;
}
