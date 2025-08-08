package com.exence.finance.modules.category.service.impl;

import com.exence.finance.modules.category.dto.CategoryDTO;
import com.exence.finance.common.exception.CategoryAlreadyExistsException;
import com.exence.finance.common.exception.CategoryNotFoundException;
import com.exence.finance.common.exception.UserNotFoundException;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        return convertToDTO(category);
    }

    public List<CategoryDTO> getCategoriesByUserId(Long userId) {
        List<Category> categories = categoryRepository.findByUserId(userId);
        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        Optional<Category> existingCategory = categoryRepository.findByUserIdAndName(userId, categoryDTO.getName());
        if (existingCategory.isPresent()) {
            throw new CategoryAlreadyExistsException("Category with the same name already exists for you!");
        }
        Category category = convertToEntity(categoryDTO);
        category.setUser(user);
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        category.setName(categoryDTO.getName());
        category.setEmoji(categoryDTO.getEmoji());
        Category updatedCategory = categoryRepository.save(category);
        return convertToDTO(updatedCategory);
    }

    public CategoryDTO patchCategory(Long id, Map<String, Object> updates) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        updates.forEach((key, value) -> {
            Field field = ReflectionUtils.findField(Category.class, key);
            field.setAccessible(true);
            ReflectionUtils.setField(field, category, value);
        });
        Category updatedCategory = categoryRepository.save(category);
        return convertToDTO(updatedCategory);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    private CategoryDTO convertToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .emoji(category.getEmoji())
                .build();
    }

    private Category convertToEntity(CategoryDTO categoryDTO) {
        return Category.builder()
                .name(categoryDTO.getName())
                .emoji(categoryDTO.getEmoji())
                .build();
    }
}
