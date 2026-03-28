package com.exence.finance.modules.category.service.impl;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.category.dto.CategoryDTO;
import com.exence.finance.modules.category.dto.CategorySummaryResponse;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.mapper.CategoryMapper;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.category.service.CategoryService;
import com.exence.finance.modules.statistics.event.MaterializedViewRefreshEvent;
import com.exence.finance.modules.transaction.dto.request.CategoryFilter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final UserService userService;
    private final ApplicationEventPublisher eventPublisher;

    public CategoryDTO getCategoryById(Long id) {
        Category category =
                categoryRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

        return categoryMapper.mapToCategoryDTO(category);
    }

    public List<CategoryDTO> getCategories() {
        List<Category> categories = categoryRepository.findAll();

        return categoryMapper.mapToCategoryDTOList(categories);
    }

    public List<CategorySummaryResponse> getTopCategoriesByTotalAmount(CategoryFilter filter) {
        return categoryRepository.findTopCategoriesByTotalAmount(filter.getType());
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        User user = userService.getCurrentUser();

        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new ExenceException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        Category category = categoryMapper.mapToCategory(categoryDTO);
        category.setUser(user);
        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.mapToCategoryDTO(savedCategory);
    }

    @Transactional
    public CategoryDTO updateCategory(CategoryDTO categoryDTO) {
        Category category = categoryRepository
                .find(categoryDTO.getId())
                .orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

        if (categoryRepository.existsByNameAndIdNot(categoryDTO.getName(), categoryDTO.getId())) {
            throw new ExenceException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        categoryMapper.updateCategoryFromDto(categoryDTO, category);
        Category updatedCategory = categoryRepository.save(category);

        eventPublisher.publishEvent(new MaterializedViewRefreshEvent());
        return categoryMapper.mapToCategoryDTO(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category =
                categoryRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

        if (category.getTransactions() != null && !category.getTransactions().isEmpty()) {
            throw new ExenceException(ErrorCode.CATEGORY_IN_USE);
        }

        categoryRepository.delete(category);
    }
}
