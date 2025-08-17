package com.exence.finance.modules.category.service.impl;

import com.exence.finance.common.exception.CategoryAlreadyExistsException;
import com.exence.finance.common.exception.CategoryNotFoundException;
import com.exence.finance.common.exception.UserNotFoundException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.impl.UserServiceImpl;
import com.exence.finance.modules.category.dto.CategoryDTO;
import com.exence.finance.modules.category.dto.request.CategoryIdRequest;
import com.exence.finance.modules.category.dto.request.CreateCategoryRequest;
import com.exence.finance.modules.category.dto.request.DeleteCategoryRequest;
import com.exence.finance.modules.category.dto.request.EmptyCategoryRequest;
import com.exence.finance.modules.category.dto.request.UpdateCategoryRequest;
import com.exence.finance.modules.category.dto.response.CategoryResponse;
import com.exence.finance.modules.category.dto.response.CreateCategoryResponse;
import com.exence.finance.modules.category.dto.response.EmptyCategoryResponse;
import com.exence.finance.modules.category.dto.response.GetCategoriesResponse;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final UserServiceImpl userService;

    public CategoryResponse getCategory(CategoryIdRequest request) {
        Category category = categoryRepository.findById(request.getId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        return CategoryResponse.builder()
                .category(convertToDTO(category))
                .build();
    }

    public GetCategoriesResponse getCategories(EmptyCategoryRequest request) {
        Long userId = userService.getUserId();
        List<Category> categories = categoryRepository.findByUserId(userId);

        List<CategoryDTO> categoryDTOs = categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return GetCategoriesResponse.builder()
                .categories(categoryDTOs)
                .build();
    }

    public CreateCategoryResponse createCategory(CreateCategoryRequest request) {
        Long userId = userService.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Optional<Category> existingCategory = categoryRepository.findByUserIdAndName(userId, request.getCategory().getName());
        if (existingCategory.isPresent()) {
            throw new CategoryAlreadyExistsException("Category with the same name already exists for you!");
        }
        Category category = convertToEntity(request.getCategory());
        category.setUser(user);
        Category savedCategory = categoryRepository.save(category);
        return CreateCategoryResponse.builder()
                .category(convertToDTO(savedCategory))
                .build();
    }

    public CategoryResponse updateCategory(UpdateCategoryRequest request) {
        CategoryDTO categoryDTO = request.getCategory();
        Category category = categoryRepository.findById(categoryDTO.getId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        category.setName(categoryDTO.getName());
        category.setEmoji(categoryDTO.getEmoji());
        Category updatedCategory = categoryRepository.save(category);
        return CategoryResponse.builder()
                .category(convertToDTO(updatedCategory))
                .build();
    }

    public EmptyCategoryResponse deleteCategory(DeleteCategoryRequest request) {
        categoryRepository.deleteById(request.getId());
        return EmptyCategoryResponse.builder()
                .build();
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
