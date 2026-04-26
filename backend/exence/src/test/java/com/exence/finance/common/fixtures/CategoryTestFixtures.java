package com.exence.finance.common.fixtures;

import com.exence.finance.modules.category.dto.CategoryCreateDTO;
import com.exence.finance.modules.category.dto.CategoryGetDTO;
import com.exence.finance.modules.category.dto.CategoryPatchDTO;
import com.exence.finance.modules.category.dto.CategoryType;
import com.exence.finance.modules.category.dto.MaterialIcon;
import com.exence.finance.modules.category.entity.Category;
import java.math.BigDecimal;

public final class CategoryTestFixtures {

    private CategoryTestFixtures() {}

    public static Category expenseCategory() {
        return Category.builder()
                .id(1L)
                .name("Food")
                .icon(MaterialIcon.LOCAL_GROCERY_STORE)
                .color("#FF5722")
                .type(CategoryType.EXPENSE)
                .build();
    }

    public static Category incomeCategory() {
        return Category.builder()
                .id(2L)
                .name("Salary")
                .icon(MaterialIcon.WORK)
                .color("#4CAF50")
                .type(CategoryType.INCOME)
                .build();
    }

    public static CategoryCreateDTO createRequest() {
        return new CategoryCreateDTO("Food", MaterialIcon.LOCAL_GROCERY_STORE, "#FF5722", CategoryType.EXPENSE, null);
    }

    public static CategoryPatchDTO patchRequest() {
        return new CategoryPatchDTO("Updated Food", null, null, null, null);
    }

    public static CategoryGetDTO getDTO() {
        return new CategoryGetDTO(
                1L, "Food", MaterialIcon.LOCAL_GROCERY_STORE, "#FF5722", CategoryType.EXPENSE, null, BigDecimal.ZERO);
    }
}
