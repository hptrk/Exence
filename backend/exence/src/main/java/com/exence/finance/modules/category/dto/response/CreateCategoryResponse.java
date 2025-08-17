package com.exence.finance.modules.category.dto.response;

import com.exence.finance.modules.category.dto.CategoryDTO;
import com.exence.finance.modules.transaction.dto.TransactionDTO;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class CreateCategoryResponse implements Serializable {
    @Valid
    private CategoryDTO category;
}
