package com.exence.finance.modules.category.service;

import com.exence.finance.modules.category.dto.CategoryDTO;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface CategoryService {
    public CategoryDTO getCategoryById(@PathVariable Long id);

    public List<CategoryDTO> getCategories();

    public CategoryDTO createCategory(CategoryDTO categoryDTO);

    public CategoryDTO updateCategory(CategoryDTO categoryDTO);

    public void deleteCategory(Long id);
}
