package com.exence.finance.modules.category.dto.response;

import com.exence.finance.modules.category.dto.CategoryDTO;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.util.List;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class GetCategoriesResponse implements Serializable {
    @Valid
    private List<CategoryDTO> categories;
}

