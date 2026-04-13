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
import com.exence.finance.modules.category.dto.projection.CategoryBalanceSums;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.mapper.CategoryMapper;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.category.service.CategoryService;
import com.exence.finance.modules.statistics.event.MaterializedViewRefreshEvent;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
    public Category getCategory(Long id) {
        return categoryRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    @ReadTransactional
    public CategoryGetDTO getCategoryById(Long id) {
        return categoryMapper.mapToCategoryGetDTO(getCategory(id));
    }

    @ReadTransactional
    public List<CategoryGetDTO> getCategories() {
        List<Category> categories = categoryRepository.findAll();
        Map<Long, CategoryBalanceSums> balanceMap = categoryRepository.findCategoryBalances().stream()
                .collect(Collectors.toMap(CategoryBalanceSums::getId, b -> b));

        return categories.stream()
                .map(category -> categoryMapper.mapToCategoryGetDTO(category, calculateBalance(category, balanceMap)))
                .toList();
    }

    private BigDecimal calculateBalance(Category category, Map<Long, CategoryBalanceSums> balanceMap) {
        CategoryBalanceSums sums = balanceMap.get(category.getId());
        BigDecimal totalIncome = sums != null ? sums.getTotalIncome() : BigDecimal.ZERO;
        BigDecimal totalExpense = sums != null ? sums.getTotalExpense() : BigDecimal.ZERO;

        return switch (category.getType()) {
            case INCOME -> totalIncome;
            case EXPENSE -> totalExpense;
            case MIXED -> totalIncome.subtract(totalExpense);
        };
    }

    @ReadTransactional
    public List<CategorySummaryResponse> getTopCategoriesByTotalAmount(CategoryFilter filter) {
        TransactionType transactionType =
                switch (filter.type()) {
                    case INCOME -> TransactionType.INCOME;
                    case EXPENSE -> TransactionType.EXPENSE;
                    case MIXED -> throw new ExenceException(ErrorCode.ILLEGAL_ARGUMENT);
                };
        return categoryRepository.findTopCategoriesByTotalAmount(filter.type(), transactionType);
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
        Category category = getCategory(id);

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
        Category category = getCategory(id);

        if (category.getTransactions() != null && !category.getTransactions().isEmpty()) {
            throw new ExenceException(ErrorCode.CATEGORY_IN_USE);
        }

        categoryRepository.delete(category);
    }
}
