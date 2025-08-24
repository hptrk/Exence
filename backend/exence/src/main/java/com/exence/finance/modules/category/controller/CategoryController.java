package com.exence.finance.modules.category.controller;

import com.exence.finance.modules.category.dto.CategoryDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface CategoryController {
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id);

    public ResponseEntity<List<CategoryDTO>> getCategories();

    public ResponseEntity<CategoryDTO> createCategory(CategoryDTO categoryDTO);

    public ResponseEntity<CategoryDTO> updateCategory(Long id, CategoryDTO categoryDTO);

    public ResponseEntity<Void> deleteCategory(Long id);
}
