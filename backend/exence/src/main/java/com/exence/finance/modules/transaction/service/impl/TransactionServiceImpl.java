package com.exence.finance.modules.transaction.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.auth.service.UserSettingsService;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import com.exence.finance.modules.statistics.event.MaterializedViewRefreshEvent;
import com.exence.finance.modules.transaction.dto.TransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.TransactionFilter;
import com.exence.finance.modules.transaction.dto.TransactionGetDTO;
import com.exence.finance.modules.transaction.dto.TransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionTotalsResponse;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.Transaction;
import com.exence.finance.modules.transaction.event.BaseCurrencyChangedEvent;
import com.exence.finance.modules.transaction.event.TransactionCreatedEvent;
import com.exence.finance.modules.transaction.mapper.TransactionMapper;
import com.exence.finance.modules.transaction.repository.TransactionPredicateBuilder;
import com.exence.finance.modules.transaction.repository.TransactionRepository;
import com.exence.finance.modules.transaction.service.TransactionService;
import com.querydsl.core.types.Predicate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final ExchangeRateService exchangeRateService;
    private final TransactionMapper transactionMapper;
    private final ApplicationEventPublisher eventPublisher;
    private final UserSettingsService userSettingsService;

    @ReadTransactional
    public TransactionGetDTO getTransactionById(Long id) {
        Transaction transaction =
                transactionRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.TRANSACTION_NOT_FOUND));

        return transactionMapper.mapToTransactionGetDTO(transaction);
    }

    @ReadTransactional
    public Page<TransactionGetDTO> getTransactions(TransactionFilter filter, Pageable pageable) {
        Page<Transaction> transactions;
        Predicate predicate = TransactionPredicateBuilder.buildPredicate(filter);

        if (predicate != null) {
            transactions = transactionRepository.findAll(predicate, pageable);
        } else {
            transactions = transactionRepository.findAll(pageable);
        }

        return transactions.map(transactionMapper::mapToTransactionGetDTO);
    }

    @WriteTransactional
    public TransactionGetDTO createTransaction(TransactionCreateDTO transactionCreateDTO) {
        User user = userService.getCurrentUser();
        Transaction transaction = transactionMapper.mapToTransaction(transactionCreateDTO);

        Category category = categoryRepository
                .find(transactionCreateDTO.categoryId())
                .orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

        transaction.setCategory(category);
        transaction.setUser(user);
        transaction.setCreatedByRecurringJob(false);

        applyCurrencyFields(transaction, transactionCreateDTO.currency(), transactionCreateDTO.exchangeRate());

        Transaction savedTransaction = transactionRepository.save(transaction);
        eventPublisher.publishEvent(new MaterializedViewRefreshEvent());
        eventPublisher.publishEvent(new TransactionCreatedEvent(user.getId()));
        return transactionMapper.mapToTransactionGetDTO(savedTransaction);
    }

    @WriteTransactional
    public TransactionGetDTO updateTransaction(Long id, TransactionPatchDTO transactionPatchDTO) {
        Transaction transaction =
                transactionRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.TRANSACTION_NOT_FOUND));

        if (transactionPatchDTO.categoryId() != null
                && !transactionPatchDTO
                        .categoryId()
                        .equals(transaction.getCategory().getId())) {

            Category category = categoryRepository
                    .find(transactionPatchDTO.categoryId())
                    .orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

            transaction.setCategory(category);
        }

        transactionMapper.updateTransactionFromPatchDto(transactionPatchDTO, transaction);

        applyCurrencyFields(transaction, transactionPatchDTO.currency(), transactionPatchDTO.exchangeRate());

        Transaction savedTransaction = transactionRepository.save(transaction);
        eventPublisher.publishEvent(new MaterializedViewRefreshEvent());
        return transactionMapper.mapToTransactionGetDTO(savedTransaction);
    }

    @WriteTransactional
    public void deleteTransaction(Long id) {
        Transaction transaction =
                transactionRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.TRANSACTION_NOT_FOUND));
        transactionRepository.delete(transaction);
        eventPublisher.publishEvent(new MaterializedViewRefreshEvent());
    }

    @ReadTransactional
    public TransactionTotalsResponse getTransactionTotals() {
        BigDecimal totalIncome = transactionRepository.sumByType(TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumByType(TransactionType.EXPENSE);

        return new TransactionTotalsResponse(totalIncome, totalExpense);
    }

    @EventListener
    @WriteTransactional
    public void handleBaseCurrencyChanged(BaseCurrencyChangedEvent event) {
        recalculateBaseCurrencyAmounts(event.newBaseCurrency());
    }

    private void recalculateBaseCurrencyAmounts(SupportedCurrency newBaseCurrency) {
        List<Transaction> transactions = transactionRepository.findAllUserFiltered();

        LocalDate startDate = transactions.stream()
                .map(Transaction::getDate)
                .min(LocalDate::compareTo)
                .orElse(LocalDate.now());

        LocalDate endDate = transactions.stream()
                .map(Transaction::getDate)
                .max(LocalDate::compareTo)
                .orElse(LocalDate.now());

        Set<SupportedCurrency> currenciesToFetch =
                transactions.stream().map(Transaction::getCurrency).collect(Collectors.toSet());
        currenciesToFetch.add(newBaseCurrency);

        log.info("Pre-fetching exchange rates from {} to {} for currencies: {}", startDate, endDate, currenciesToFetch);
        exchangeRateService.fetchAndCacheRatesForDateRange(startDate, endDate, currenciesToFetch);

        Map<LocalDate, Map<SupportedCurrency, BigDecimal>> rates =
                exchangeRateService.getRates(startDate, endDate, currenciesToFetch);

        for (Transaction transaction : transactions) {
            SupportedCurrency txCurrency = transaction.getCurrency();
            LocalDate txDate = transaction.getDate();

            BigDecimal exchangeRate = exchangeRateService.getRate(txCurrency, newBaseCurrency, txDate, rates);

            BigDecimal baseAmount =
                    exchangeRateService.calculateBaseCurrencyAmount(transaction.getAmount(), txCurrency, txDate, rates);

            transaction.setExchangeRate(exchangeRate);
            transaction.setBaseCurrencyAmount(baseAmount);
        }

        transactionRepository.saveAll(transactions);
        eventPublisher.publishEvent(new MaterializedViewRefreshEvent());
    }

    private void applyCurrencyFields(
            Transaction transaction, SupportedCurrency currencyFromDTO, BigDecimal exchangeRateFromDTO) {
        SupportedCurrency baseCurrency = userSettingsService.getUserBaseCurrency();

        SupportedCurrency currency = currencyFromDTO != null ? currencyFromDTO : baseCurrency;
        transaction.setCurrency(currency);

        if (currency == baseCurrency) {
            transaction.setExchangeRate(BigDecimal.ONE);
            transaction.setBaseCurrencyAmount(transaction.getAmount());
        } else {
            BigDecimal exchangeRate = exchangeRateFromDTO != null
                    ? exchangeRateFromDTO
                    : exchangeRateService.getRate(currency, baseCurrency, transaction.getDate());

            transaction.setExchangeRate(exchangeRate);
            transaction.setBaseCurrencyAmount(exchangeRateService.calculateBaseCurrencyAmount(
                    transaction.getAmount(), currency, transaction.getDate(), exchangeRate));
        }
    }
}
