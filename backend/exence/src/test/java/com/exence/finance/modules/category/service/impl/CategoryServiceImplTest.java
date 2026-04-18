package com.exence.finance.modules.category.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.CategoryTestFixtures;
import com.exence.finance.common.fixtures.TransactionTestFixtures;
import com.exence.finance.modules.category.dto.CategoryCreateDTO;
import com.exence.finance.modules.category.dto.CategoryGetDTO;
import com.exence.finance.modules.category.dto.CategoryType;
import com.exence.finance.modules.category.dto.MaterialIcon;
import com.exence.finance.modules.category.dto.projection.CategoryBalanceSums;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.mapper.CategoryMapper;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.transaction.entity.Transaction;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Test
    @DisplayName("returns total income for INCOME category type")
    void calculateBalance_income() {
        // given
        Category incomeCategory = CategoryTestFixtures.incomeCategory();
        CategoryBalanceSums sums =
                balanceSums(incomeCategory.getId(), new BigDecimal("500.00"), new BigDecimal("0.00"));

        given(categoryRepository.findAll()).willReturn(List.of(incomeCategory));
        given(categoryRepository.findCategoryBalances()).willReturn(List.of(sums));
        given(categoryMapper.mapToCategoryGetDTO(eq(incomeCategory), any(BigDecimal.class)))
                .willAnswer(inv -> new CategoryGetDTO(
                        incomeCategory.getId(),
                        incomeCategory.getName(),
                        incomeCategory.getIcon(),
                        incomeCategory.getColor(),
                        incomeCategory.getType(),
                        null,
                        inv.getArgument(1)));

        // when
        List<CategoryGetDTO> result = categoryService.getCategories();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.getFirst().balance()).isEqualByComparingTo(new BigDecimal("500.00"));
    }

    @Test
    @DisplayName("returns total expense for EXPENSE category type")
    void calculateBalance_expense() {
        // given
        Category expenseCategory = CategoryTestFixtures.expenseCategory();
        CategoryBalanceSums sums =
                balanceSums(expenseCategory.getId(), new BigDecimal("0.00"), new BigDecimal("200.00"));

        given(categoryRepository.findAll()).willReturn(List.of(expenseCategory));
        given(categoryRepository.findCategoryBalances()).willReturn(List.of(sums));
        given(categoryMapper.mapToCategoryGetDTO(eq(expenseCategory), any(BigDecimal.class)))
                .willAnswer(inv -> new CategoryGetDTO(
                        expenseCategory.getId(),
                        expenseCategory.getName(),
                        expenseCategory.getIcon(),
                        expenseCategory.getColor(),
                        expenseCategory.getType(),
                        null,
                        inv.getArgument(1)));

        // when
        List<CategoryGetDTO> result = categoryService.getCategories();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).balance()).isEqualByComparingTo(new BigDecimal("200.00"));
    }

    @Test
    @DisplayName("throws CATEGORY_ALREADY_EXISTS when name is duplicate")
    void create_duplicateName() {
        // given
        CategoryCreateDTO dto =
                new CategoryCreateDTO("Food", MaterialIcon.LOCAL_GROCERY_STORE, "#FF5722", CategoryType.EXPENSE, null);
        given(categoryRepository.existsByName("Food")).willReturn(true);

        // when / then
        assertThatThrownBy(() -> categoryService.createCategory(dto))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CATEGORY_ALREADY_EXISTS);
    }

    @Test
    @DisplayName("throws CATEGORY_IN_USE when category has transactions")
    void delete_inUse() {
        // given
        Category category = CategoryTestFixtures.expenseCategory();
        Transaction tx = TransactionTestFixtures.defaultTransaction();
        category.setTransactions(List.of(tx));

        given(categoryRepository.find(category.getId())).willReturn(Optional.of(category));

        // when / then
        assertThatThrownBy(() -> categoryService.deleteCategory(category.getId()))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CATEGORY_IN_USE);

        then(categoryRepository).should(never()).delete(any());
    }

    @Test
    @DisplayName("throws CATEGORY_NOT_FOUND when category does not exist")
    void getById_notFound() {
        // given
        given(categoryRepository.find(99L)).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> categoryService.getCategoryById(99L))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CATEGORY_NOT_FOUND);
    }

    private CategoryBalanceSums balanceSums(Long id, BigDecimal income, BigDecimal expense) {
        return new CategoryBalanceSums() {
            @Override
            public Long getId() {
                return id;
            }

            @Override
            public BigDecimal getTotalIncome() {
                return income;
            }

            @Override
            public BigDecimal getTotalExpense() {
                return expense;
            }
        };
    }
}
