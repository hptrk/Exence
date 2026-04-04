package com.exence.finance.modules.category.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.category.dto.CategoryCreateDTO;
import com.exence.finance.modules.category.dto.CategoryFilter;
import com.exence.finance.modules.category.dto.CategoryGetDTO;
import com.exence.finance.modules.category.dto.CategoryPatchDTO;
import com.exence.finance.modules.category.dto.CategorySummaryResponse;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.mapper.CategoryMapper;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.category.service.CategoryService;
import com.exence.finance.modules.statistics.event.MaterializedViewRefreshEvent;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final UserService userService;
    private final ApplicationEventPublisher eventPublisher;

    @ReadTransactional
    public CategoryGetDTO getCategoryById(Long id) {
        Category category =
                categoryRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

        return categoryMapper.mapToCategoryGetDTO(category);
    }

    @ReadTransactional
    public List<CategoryGetDTO> getCategories() {
        List<Category> categories = categoryRepository.findAll();

        return categoryMapper.mapToCategoryGetDTOList(categories);
    }

    @ReadTransactional
    public List<CategorySummaryResponse> getTopCategoriesByTotalAmount(CategoryFilter filter) {
        return categoryRepository.findTopCategoriesByTotalAmount(filter.type());
    }

    @WriteTransactional
    public CategoryGetDTO createCategory(CategoryCreateDTO categoryCreateDTO) {
        User user = userService.getCurrentUser();

        if (categoryRepository.existsByName(categoryCreateDTO.name())) {
            throw new ExenceException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        Category category = categoryMapper.mapToCategory(categoryCreateDTO);
        category.setUser(user);
        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.mapToCategoryGetDTO(savedCategory);
    }

    @WriteTransactional
    public CategoryGetDTO updateCategory(Long id, CategoryPatchDTO categoryPatchDTO) {
        Category category =
                categoryRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

        if (categoryPatchDTO.name() != null && categoryRepository.existsByNameAndIdNot(categoryPatchDTO.name(), id)) {
            throw new ExenceException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        categoryMapper.updateCategoryFromPatchDto(categoryPatchDTO, category);
        Category updatedCategory = categoryRepository.save(category);

        eventPublisher.publishEvent(new MaterializedViewRefreshEvent());
        return categoryMapper.mapToCategoryGetDTO(updatedCategory);
    }

    @WriteTransactional
    public void deleteCategory(Long id) {
        Category category =
                categoryRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

        if (category.getTransactions() != null && !category.getTransactions().isEmpty()) {
            throw new ExenceException(ErrorCode.CATEGORY_IN_USE);
        }

        categoryRepository.delete(category);
    }
}
