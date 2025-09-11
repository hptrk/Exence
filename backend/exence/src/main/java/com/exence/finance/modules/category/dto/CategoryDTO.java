package com.exence.finance.modules.category.dto;

import com.exence.finance.common.annotations.ValidEmoji;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.CATEGORY_NAME_MIN_LENGTH;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false, exclude = { "" })
@ToString(callSuper = true, exclude = { "" })
@JsonIdentityInfo(generator = com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = CategoryDTO.class)
public class CategoryDTO {
    private Long id;

    @NotBlank(message = "Category name cannot be blank")
    @Size(min = CATEGORY_NAME_MIN_LENGTH,
            max = CATEGORY_NAME_MAX_LENGTH,
            message = "Category name must be between " + CATEGORY_NAME_MIN_LENGTH + " and " + CATEGORY_NAME_MAX_LENGTH + " characters")
    private String name;

    @ValidEmoji(allowEmpty = false, message = "Must contain exactly one emoji character")
    private String emoji;
}
