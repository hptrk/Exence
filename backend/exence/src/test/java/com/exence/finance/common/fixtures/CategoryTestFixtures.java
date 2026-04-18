package com.exence.finance.common.fixtures;

import com.exence.finance.modules.category.dto.CategoryType;
import com.exence.finance.modules.category.dto.MaterialIcon;
import com.exence.finance.modules.category.entity.Category;

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
}
