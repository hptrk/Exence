package com.exence.finance.modules.category.controller;

import com.exence.finance.modules.category.dto.CategoryDTO;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

public interface CategoryController {
    ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id);

    ResponseEntity<List<CategoryDTO>> getCategories();

    ResponseEntity<CategoryDTO> createCategory(CategoryDTO categoryDTO);

    ResponseEntity<CategoryDTO> updateCategory(Long id, CategoryDTO categoryDTO);

    ResponseEntity<Void> deleteCategory(Long id);
}
