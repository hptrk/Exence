package com.exence.finance.modules.category.service.impl;

import com.exence.finance.common.exception.CategoryInUseException;
import com.exence.finance.common.exception.CategoryNotFoundException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.category.dto.CategoryDTO;
import com.exence.finance.modules.category.dto.CategorySummaryResponse;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.mapper.CategoryMapper;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final UserService userService;

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.find(id)
                .orElseThrow(CategoryNotFoundException::new);

        return categoryMapper.mapToCategoryDTO(category);
    }

    public List<CategoryDTO> getCategories() {
        List<Category> categories = categoryRepository.findAll();

        return categoryMapper.mapToCategoryDTOList(categories);
    }

    public List<CategorySummaryResponse> getTop4CategoriesByTotalAmount() {
        return categoryRepository.findTop4CategoriesByTotalAmount();
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        User user = userService.getCurrentUser();

        Category category = categoryMapper.mapToCategory(categoryDTO);
        category.setUser(user);
        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.mapToCategoryDTO(savedCategory);
    }

    @Transactional
    public CategoryDTO updateCategory(CategoryDTO categoryDTO) {
        Category category = categoryRepository.find(categoryDTO.getId())
                .orElseThrow(CategoryNotFoundException::new);

        categoryMapper.updateCategoryFromDto(categoryDTO, category);
        Category updatedCategory = categoryRepository.save(category);

        return categoryMapper.mapToCategoryDTO(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.find(id)
                .orElseThrow(CategoryNotFoundException::new);

        if (category.getTransactions() != null && !category.getTransactions().isEmpty()) {
            throw new CategoryInUseException();
        }

        categoryRepository.delete(category);
    }
}
