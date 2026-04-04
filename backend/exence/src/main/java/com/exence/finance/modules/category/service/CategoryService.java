package com.exence.finance.modules.category.service;

import com.exence.finance.modules.category.dto.CategoryCreateDTO;
import com.exence.finance.modules.category.dto.CategoryFilter;
import com.exence.finance.modules.category.dto.CategoryGetDTO;
import com.exence.finance.modules.category.dto.CategoryPatchDTO;
import com.exence.finance.modules.category.dto.CategorySummaryResponse;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;

public interface CategoryService {
    CategoryGetDTO getCategoryById(@PathVariable Long id);

    List<CategoryGetDTO> getCategories();

    List<CategorySummaryResponse> getTopCategoriesByTotalAmount(CategoryFilter filter);

    CategoryGetDTO createCategory(CategoryCreateDTO categoryCreateDTO);

    CategoryGetDTO updateCategory(Long id, CategoryPatchDTO categoryPatchDTO);

    void deleteCategory(Long id);
}
