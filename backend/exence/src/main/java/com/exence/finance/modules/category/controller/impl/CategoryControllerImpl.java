package com.exence.finance.modules.category.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.category.controller.CategoryController;
import com.exence.finance.modules.category.dto.CategoryDTO;
import com.exence.finance.modules.category.dto.CategorySummaryResponse;
import com.exence.finance.modules.category.service.CategoryService;
import com.exence.finance.modules.transaction.dto.request.CategoryFilter;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class CategoryControllerImpl implements CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        CategoryDTO categoryDTO = categoryService.getCategoryById(id);
        return ResponseFactory.ok(categoryDTO);
    }

    @GetMapping()
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        List<CategoryDTO> categoryDTOs = categoryService.getCategories();
        return ResponseFactory.ok(categoryDTOs);
    }

    @GetMapping("/top")
    public ResponseEntity<List<CategorySummaryResponse>> getTopCategoreiesByTotalAmount(
            @Valid @ModelAttribute CategoryFilter filter) {
        List<CategorySummaryResponse> topCategories = categoryService.getTopCategoriesByTotalAmount(filter);
        return ResponseFactory.ok(topCategories);
    }

    @PostMapping()
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO created = categoryService.createCategory(categoryDTO);
        return ResponseFactory.created(created.id(), created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(
            @PathVariable Long id, @Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO updated = categoryService.updateCategory(categoryDTO);
        return ResponseFactory.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseFactory.noContent();
    }
}
