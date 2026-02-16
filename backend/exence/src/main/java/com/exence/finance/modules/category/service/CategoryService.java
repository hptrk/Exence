package com.exence.finance.modules.category.service;

import com.exence.finance.modules.category.dto.CategoryDTO;
import com.exence.finance.modules.category.dto.CategorySummaryResponse;
import com.exence.finance.modules.transaction.dto.request.CategoryFilter;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;

public interface CategoryService {
    CategoryDTO getCategoryById(@PathVariable Long id);

    List<CategoryDTO> getCategories();

    List<CategorySummaryResponse> getTopCategoriesByTotalAmount(CategoryFilter filter);

    CategoryDTO createCategory(CategoryDTO categoryDTO);

    CategoryDTO updateCategory(CategoryDTO categoryDTO);

    void deleteCategory(Long id);
}
