package com.exence.finance.modules.category.controller;

import com.exence.finance.modules.category.dto.CategoryCreateDTO;
import com.exence.finance.modules.category.dto.CategoryFilter;
import com.exence.finance.modules.category.dto.CategoryGetDTO;
import com.exence.finance.modules.category.dto.CategoryPatchDTO;
import com.exence.finance.modules.category.dto.CategorySummaryResponse;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

public interface CategoryController {
    ResponseEntity<CategoryGetDTO> getCategoryById(@PathVariable Long id);

    ResponseEntity<List<CategoryGetDTO>> getCategories();

    ResponseEntity<List<CategorySummaryResponse>> getTopCategoreiesByTotalAmount(CategoryFilter filter);

    ResponseEntity<CategoryGetDTO> createCategory(CategoryCreateDTO categoryCreateDTO);

    ResponseEntity<CategoryGetDTO> updateCategory(Long id, CategoryPatchDTO categoryPatchDTO);

    ResponseEntity<Void> deleteCategory(Long id);
}
