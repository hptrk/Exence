package com.exence.finance.modules.category.service.impl;

import com.exence.finance.common.exception.CategoryAlreadyExistsException;
import com.exence.finance.common.exception.CategoryNotFoundException;
import com.exence.finance.common.exception.UserNotFoundException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.category.dto.CategoryDTO;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.mapper.CategoryMapper;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final CategoryMapper categoryMapper;

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        return categoryMapper.mapToCategoryDTO(category);
    }

    public List<CategoryDTO> getCategories() {
        Long userId = userService.getUserId();
        List<Category> categories = categoryRepository.findByUserId(userId);

        return categoryMapper.mapToCategoryDTOList(categories);
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Long userId = userService.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Optional<Category> existingCategory = categoryRepository.findByUserIdAndName(userId, categoryDTO.getName());
        if (existingCategory.isPresent()) {
            throw new CategoryAlreadyExistsException("Category with the same name already exists for you!");
        }

        Category category = categoryMapper.mapToCategory(categoryDTO);
        category.setUser(user);
        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.mapToCategoryDTO(savedCategory);
    }

    public CategoryDTO updateCategory(CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(categoryDTO.getId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        categoryMapper.updateCategoryFromDto(categoryDTO, category);
        Category updatedCategory = categoryRepository.save(category);

        return categoryMapper.mapToCategoryDTO(updatedCategory);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
