package com.exence.finance.modules.transaction.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserSettingsRepository;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import com.exence.finance.modules.statistics.event.MaterializedViewRefreshEvent;
import com.exence.finance.modules.transaction.dto.TransactionDTO;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.dto.request.TransactionFilter;
import com.exence.finance.modules.transaction.dto.response.TransactionTotalsResponse;
import com.exence.finance.modules.transaction.entity.Transaction;
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
    private final UserSettingsRepository userSettingsRepository;
    private final ExchangeRateService exchangeRateService;
    private final TransactionMapper transactionMapper;
    private final ApplicationEventPublisher eventPublisher;

    @ReadTransactional
    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction =
                transactionRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.TRANSACTION_NOT_FOUND));

        return transactionMapper.mapToTransactionDTO(transaction);
    }

    @ReadTransactional
    public Page<TransactionDTO> getTransactions(TransactionFilter filter, Pageable pageable) {
        Page<Transaction> transactions;
        Predicate predicate = TransactionPredicateBuilder.buildPredicate(filter);

        if (predicate != null) {
            transactions = transactionRepository.findAll(predicate, pageable);
        } else {
            transactions = transactionRepository.findAll(pageable);
        }

        return transactions.map(transactionMapper::mapToTransactionDTO);
    }

    @WriteTransactional
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        User user = userService.getCurrentUser();
        Transaction transaction = transactionMapper.mapToTransaction(transactionDTO);

        Category category = categoryRepository
                .find(transactionDTO.getCategoryId())
                .orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

        transaction.setCategory(category);
        transaction.setUser(user);

        applyCurrencyFields(transaction, transactionDTO);

        Transaction savedTransaction = transactionRepository.save(transaction);
        eventPublisher.publishEvent(new MaterializedViewRefreshEvent());
        return transactionMapper.mapToTransactionDTO(savedTransaction);
    }

    @WriteTransactional
    public TransactionDTO updateTransaction(TransactionDTO transactionDTO) {
        Transaction transaction = transactionRepository
                .find(transactionDTO.getId())
                .orElseThrow(() -> new ExenceException(ErrorCode.TRANSACTION_NOT_FOUND));

        if (transactionDTO.getCategoryId() != null
                && !transactionDTO
                        .getCategoryId()
                        .equals(transaction.getCategory().getId())) {

            Category category = categoryRepository
                    .find(transactionDTO.getCategoryId())
                    .orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

            transaction.setCategory(category);
        }

        transactionMapper.updateTransactionFromDto(transactionDTO, transaction);

        applyCurrencyFields(transaction, transactionDTO);

        Transaction savedTransaction = transactionRepository.save(transaction);
        eventPublisher.publishEvent(new MaterializedViewRefreshEvent());
        return transactionMapper.mapToTransactionDTO(savedTransaction);
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

        return TransactionTotalsResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .build();
    }

    @WriteTransactional
    public void recalculateBaseCurrencyAmounts(SupportedCurrency newBaseCurrency) {
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

            BigDecimal baseAmount = exchangeRateService.calculateBaseCurrencyAmount(
                    transaction.getAmount(), txCurrency, newBaseCurrency, txDate, rates);

            transaction.setExchangeRate(exchangeRate);
            transaction.setBaseCurrencyAmount(baseAmount);
        }

        transactionRepository.saveAll(transactions);
        eventPublisher.publishEvent(new MaterializedViewRefreshEvent());
    }

    private void applyCurrencyFields(Transaction transaction, TransactionDTO dto) {
        SupportedCurrency baseCurrency = getUserBaseCurrency();

        SupportedCurrency currency = dto.getCurrency() != null ? dto.getCurrency() : baseCurrency;
        transaction.setCurrency(currency);

        if (currency == baseCurrency) {
            transaction.setExchangeRate(BigDecimal.ONE);
            transaction.setBaseCurrencyAmount(transaction.getAmount());
        } else {
            BigDecimal exchangeRate = dto.getExchangeRate() != null
                    ? dto.getExchangeRate()
                    : exchangeRateService.getRate(currency, baseCurrency, transaction.getDate());

            transaction.setExchangeRate(exchangeRate);
            transaction.setBaseCurrencyAmount(exchangeRateService.calculateBaseCurrencyAmount(
                    transaction.getAmount(), currency, baseCurrency, transaction.getDate(), exchangeRate));
        }
    }

    private SupportedCurrency getUserBaseCurrency() {
        Long userId = userService.getCurrentUserId();
        return userSettingsRepository
                .findBaseCurrencyByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Settings not found for user " + userId));
    }
}
