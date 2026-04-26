package com.exence.finance.modules.transaction.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.atLeastOnce;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.CategoryTestFixtures;
import com.exence.finance.common.fixtures.TransactionTestFixtures;
import com.exence.finance.modules.auth.service.UserSettingsService;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.service.CategoryService;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import com.exence.finance.modules.statistics.event.MaterializedViewRefreshEvent;
import com.exence.finance.modules.transaction.dto.TransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.TransactionGetDTO;
import com.exence.finance.modules.transaction.dto.TransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.Transaction;
import com.exence.finance.modules.transaction.event.BaseCurrencyChangedEvent;
import com.exence.finance.modules.transaction.event.TransactionCreatedEvent;
import com.exence.finance.modules.transaction.mapper.TransactionMapper;
import com.exence.finance.modules.transaction.repository.TransactionRepository;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private ExchangeRateService exchangeRateService;

    @Mock
    private TransactionMapper transactionMapper;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private UserSettingsService userSettingsService;

    @Mock
    private WorkspaceMembershipService workspaceMembershipService;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    @Test
    @DisplayName("throws TRANSACTION_NOT_FOUND when transaction does not exist")
    void getById_notFound() {
        // given
        given(transactionRepository.find(99L)).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> transactionService.getTransactionById(99L))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TRANSACTION_NOT_FOUND);
    }

    @Test
    @DisplayName("sets exchange rate to 1 when currency matches base currency")
    void create_sameCurrencyAsBase() {
        // given
        Transaction transaction = TransactionTestFixtures.defaultTransaction();
        transaction.setCurrency(SupportedCurrency.EUR);
        TransactionCreateDTO dto = createDto(SupportedCurrency.EUR, null);
        TransactionGetDTO responseDto = transactionGetDto(transaction);

        given(transactionMapper.mapToTransaction(dto)).willReturn(transaction);
        given(categoryService.getCategory(dto.categoryId())).willReturn(transaction.getCategory());
        given(workspaceMembershipService.getWorkspaceReference()).willReturn(null);
        given(userSettingsService.getUserBaseCurrency()).willReturn(SupportedCurrency.EUR);
        given(transactionRepository.save(transaction)).willReturn(transaction);
        given(transactionMapper.mapToTransactionGetDTO(transaction)).willReturn(responseDto);

        // when
        transactionService.createTransaction(dto);

        // then
        assertThat(transaction.getExchangeRate()).isEqualByComparingTo(BigDecimal.ONE);
        assertThat(transaction.getBaseCurrencyAmount()).isEqualByComparingTo(transaction.getAmount());
    }

    @Test
    @DisplayName("fetches exchange rate when foreign currency is used without provided rate")
    void create_foreignCurrency_noRate() {
        // given
        Transaction transaction = TransactionTestFixtures.defaultTransaction();
        TransactionCreateDTO dto = createDto(SupportedCurrency.USD, null);
        BigDecimal fetchedRate = new BigDecimal("0.9200");
        TransactionGetDTO responseDto = transactionGetDto(transaction);

        given(transactionMapper.mapToTransaction(dto)).willReturn(transaction);
        given(categoryService.getCategory(dto.categoryId())).willReturn(transaction.getCategory());
        given(workspaceMembershipService.getWorkspaceReference()).willReturn(null);
        given(userSettingsService.getUserBaseCurrency()).willReturn(SupportedCurrency.EUR);
        given(exchangeRateService.getRate(eq(SupportedCurrency.USD), eq(SupportedCurrency.EUR), any(LocalDate.class)))
                .willReturn(fetchedRate);
        given(exchangeRateService.calculateBaseCurrencyAmount(any(), any(), any(), eq(fetchedRate)))
                .willReturn(new BigDecimal("46.00"));
        given(transactionRepository.save(transaction)).willReturn(transaction);
        given(transactionMapper.mapToTransactionGetDTO(transaction)).willReturn(responseDto);

        // when
        transactionService.createTransaction(dto);

        // then
        assertThat(transaction.getExchangeRate()).isEqualByComparingTo(fetchedRate);
        then(exchangeRateService).should().getRate(any(), any(), any(LocalDate.class));
    }

    @Test
    @DisplayName("uses provided exchange rate without fetching")
    void create_foreignCurrency_rateProvided() {
        // given
        Transaction transaction = TransactionTestFixtures.defaultTransaction();
        BigDecimal providedRate = new BigDecimal("0.8500");
        TransactionCreateDTO dto = createDto(SupportedCurrency.USD, providedRate);
        TransactionGetDTO responseDto = transactionGetDto(transaction);

        given(transactionMapper.mapToTransaction(dto)).willReturn(transaction);
        given(categoryService.getCategory(dto.categoryId())).willReturn(transaction.getCategory());
        given(workspaceMembershipService.getWorkspaceReference()).willReturn(null);
        given(userSettingsService.getUserBaseCurrency()).willReturn(SupportedCurrency.EUR);
        given(exchangeRateService.calculateBaseCurrencyAmount(any(), any(), any(), eq(providedRate)))
                .willReturn(new BigDecimal("42.50"));
        given(transactionRepository.save(transaction)).willReturn(transaction);
        given(transactionMapper.mapToTransactionGetDTO(transaction)).willReturn(responseDto);

        // when
        transactionService.createTransaction(dto);

        // then
        assertThat(transaction.getExchangeRate()).isEqualByComparingTo(providedRate);
        then(exchangeRateService).shouldHaveNoMoreInteractions();
    }

    @Test
    @DisplayName("publishes MaterializedViewRefreshEvent after creating transaction")
    void create_publishesRefreshEvent() {
        // given
        Transaction transaction = TransactionTestFixtures.defaultTransaction();
        TransactionCreateDTO dto = createDto(SupportedCurrency.EUR, null);

        given(transactionMapper.mapToTransaction(dto)).willReturn(transaction);
        given(categoryService.getCategory(dto.categoryId())).willReturn(transaction.getCategory());
        given(workspaceMembershipService.getWorkspaceReference()).willReturn(null);
        given(userSettingsService.getUserBaseCurrency()).willReturn(SupportedCurrency.EUR);
        given(transactionRepository.save(transaction)).willReturn(transaction);
        given(transactionMapper.mapToTransactionGetDTO(transaction)).willReturn(transactionGetDto(transaction));

        // when
        transactionService.createTransaction(dto);

        // then
        ArgumentCaptor<Object> captor = ArgumentCaptor.forClass(Object.class);
        then(eventPublisher).should(atLeastOnce()).publishEvent(captor.capture());
        assertThat(captor.getAllValues()).anyMatch(e -> e instanceof MaterializedViewRefreshEvent);
    }

    @Test
    @DisplayName("publishes TransactionCreatedEvent after creating transaction")
    void create_publishesTransactionCreatedEvent() {
        // given
        Transaction transaction = TransactionTestFixtures.defaultTransaction();
        TransactionCreateDTO dto = createDto(SupportedCurrency.EUR, null);

        given(transactionMapper.mapToTransaction(dto)).willReturn(transaction);
        given(categoryService.getCategory(dto.categoryId())).willReturn(transaction.getCategory());
        given(workspaceMembershipService.getWorkspaceReference()).willReturn(null);
        given(userSettingsService.getUserBaseCurrency()).willReturn(SupportedCurrency.EUR);
        given(transactionRepository.save(transaction)).willReturn(transaction);
        given(transactionMapper.mapToTransactionGetDTO(transaction)).willReturn(transactionGetDto(transaction));

        // when
        transactionService.createTransaction(dto);

        // then
        ArgumentCaptor<Object> captor = ArgumentCaptor.forClass(Object.class);
        then(eventPublisher).should(org.mockito.Mockito.atLeastOnce()).publishEvent(captor.capture());
        assertThat(captor.getAllValues()).anyMatch(e -> e instanceof TransactionCreatedEvent);
    }

    @Test
    @DisplayName("fetches and sets new category when category id changed")
    void update_categoryChanged() {
        // given
        Transaction transaction = TransactionTestFixtures.defaultTransaction();
        Category newCategory = CategoryTestFixtures.incomeCategory();
        TransactionPatchDTO dto =
                new TransactionPatchDTO(null, null, null, null, null, newCategory.getId(), null, null);

        given(transactionRepository.find(transaction.getId())).willReturn(Optional.of(transaction));
        given(categoryService.getCategory(newCategory.getId())).willReturn(newCategory);
        given(userSettingsService.getUserBaseCurrency()).willReturn(SupportedCurrency.EUR);
        given(transactionRepository.save(transaction)).willReturn(transaction);
        given(transactionMapper.mapToTransactionGetDTO(transaction)).willReturn(transactionGetDto(transaction));

        // when
        transactionService.updateTransaction(transaction.getId(), dto);

        // then
        assertThat(transaction.getCategory()).isEqualTo(newCategory);
        then(categoryService).should().getCategory(newCategory.getId());
    }

    @Test
    @DisplayName("does not refetch category when category id is unchanged")
    void update_sameCategoryId() {
        // given
        Transaction transaction = TransactionTestFixtures.defaultTransaction();
        Long sameCategoryId = transaction.getCategory().getId();
        TransactionPatchDTO dto = new TransactionPatchDTO(null, null, null, null, null, sameCategoryId, null, null);

        given(transactionRepository.find(transaction.getId())).willReturn(Optional.of(transaction));
        given(userSettingsService.getUserBaseCurrency()).willReturn(SupportedCurrency.EUR);
        given(transactionRepository.save(transaction)).willReturn(transaction);
        given(transactionMapper.mapToTransactionGetDTO(transaction)).willReturn(transactionGetDto(transaction));

        // when
        transactionService.updateTransaction(transaction.getId(), dto);

        // then
        then(categoryService).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("throws TRANSACTION_NOT_FOUND when updating nonexistent transaction")
    void update_notFound() {
        // given
        TransactionPatchDTO dto = new TransactionPatchDTO(null, null, null, null, null, null, null, null);
        given(transactionRepository.find(99L)).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> transactionService.updateTransaction(99L, dto))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TRANSACTION_NOT_FOUND);
    }

    @Test
    @DisplayName("throws TRANSACTION_NOT_FOUND when deleting nonexistent transaction")
    void delete_notFound() {
        // given
        given(transactionRepository.find(99L)).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> transactionService.deleteTransaction(99L))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TRANSACTION_NOT_FOUND);
    }

    @Test
    @DisplayName("publishes MaterializedViewRefreshEvent after deleting transaction")
    void delete_publishesRefreshEvent() {
        // given
        Transaction transaction = TransactionTestFixtures.defaultTransaction();
        given(transactionRepository.find(transaction.getId())).willReturn(Optional.of(transaction));

        // when
        transactionService.deleteTransaction(transaction.getId());

        // then
        then(transactionRepository).should().delete(transaction);
        then(eventPublisher).should().publishEvent(any(MaterializedViewRefreshEvent.class));
    }

    @Test
    @DisplayName("recalculates base currency amounts for all transactions")
    void handleBaseCurrencyChanged_withTxs() {
        // given
        Transaction t1 = TransactionTestFixtures.foreignCurrencyTransaction();
        Transaction t2 = TransactionTestFixtures.defaultTransaction();
        BigDecimal newRate = new BigDecimal("1.10");
        BigDecimal newBase = new BigDecimal("110.00");

        given(transactionRepository.findAllWorkspaceFiltered()).willReturn(List.of(t1, t2));
        given(exchangeRateService.getRates(any(), any(), any())).willReturn(java.util.Map.of());
        given(exchangeRateService.getRate(
                        any(SupportedCurrency.class),
                        any(SupportedCurrency.class),
                        any(LocalDate.class),
                        any(java.util.Map.class)))
                .willReturn(newRate);
        given(exchangeRateService.calculateBaseCurrencyAmount(
                        any(BigDecimal.class), any(), any(LocalDate.class), any(BigDecimal.class)))
                .willReturn(newBase);
        given(transactionRepository.saveAll(any())).willReturn(List.of());

        // when
        transactionService.handleBaseCurrencyChanged(new BaseCurrencyChangedEvent(SupportedCurrency.USD));

        // then
        then(exchangeRateService).should().fetchAndCacheRatesForDateRange(any(), any(), any());
        then(transactionRepository).should().saveAll(any());
        then(eventPublisher).should().publishEvent(any(MaterializedViewRefreshEvent.class));
    }

    @Test
    @DisplayName("skips exchange rate fetch when there are no transactions")
    void handleBaseCurrencyChanged_empty() {
        // given
        given(transactionRepository.findAllWorkspaceFiltered()).willReturn(List.of());

        // when
        transactionService.handleBaseCurrencyChanged(new BaseCurrencyChangedEvent(SupportedCurrency.USD));

        // then
        then(exchangeRateService).should().fetchAndCacheRatesForDateRange(any(), any(), any());
        then(transactionRepository).should().saveAll(List.of());
    }

    private TransactionCreateDTO createDto(SupportedCurrency currency, BigDecimal rate) {
        return new TransactionCreateDTO(
                "Test transaction",
                null,
                LocalDate.of(2025, 1, 15),
                new BigDecimal("50.00"),
                TransactionType.EXPENSE,
                1L,
                currency,
                rate);
    }

    private TransactionGetDTO transactionGetDto(Transaction t) {
        return new TransactionGetDTO(
                t.getId(),
                t.getTitle(),
                t.getNote(),
                t.getDate(),
                t.getAmount(),
                t.getType(),
                t.getCreatedByRecurringJob(),
                null,
                t.getCategory().getId(),
                t.getCurrency(),
                t.getExchangeRate(),
                t.getBaseCurrencyAmount());
    }
}
