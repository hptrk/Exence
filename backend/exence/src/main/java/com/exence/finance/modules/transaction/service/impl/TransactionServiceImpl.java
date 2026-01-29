package com.exence.finance.modules.transaction.service.impl;

import com.exence.finance.common.exception.CategoryNotFoundException;
import com.exence.finance.common.exception.TransactionNotFoundException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.repository.CategoryRepository;
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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final TransactionMapper transactionMapper;

    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.find(id).orElseThrow(TransactionNotFoundException::new);

        return transactionMapper.mapToTransactionDTO(transaction);
    }

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

    @Transactional
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        User user = userService.getCurrentUser();
        Transaction transaction = transactionMapper.mapToTransaction(transactionDTO);

        Category category =
                categoryRepository.find(transactionDTO.getCategoryId()).orElseThrow(CategoryNotFoundException::new);

        transaction.setCategory(category);
        transaction.setUser(user);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return transactionMapper.mapToTransactionDTO(savedTransaction);
    }

    @Transactional
    public TransactionDTO updateTransaction(TransactionDTO transactionDTO) {
        Transaction transaction =
                transactionRepository.find(transactionDTO.getId()).orElseThrow(TransactionNotFoundException::new);

        if (transactionDTO.getCategoryId() != null
                && !transactionDTO
                        .getCategoryId()
                        .equals(transaction.getCategory().getId())) {

            Category category =
                    categoryRepository.find(transactionDTO.getCategoryId()).orElseThrow(CategoryNotFoundException::new);

            transaction.setCategory(category);
        }

        transactionMapper.updateTransactionFromDto(transactionDTO, transaction);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return transactionMapper.mapToTransactionDTO(savedTransaction);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.find(id).orElseThrow(TransactionNotFoundException::new);

        transactionRepository.delete(transaction);
    }

    public TransactionTotalsResponse getTransactionTotals() {
        BigDecimal totalIncome = transactionRepository.sumByType(TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumByType(TransactionType.EXPENSE);

        return TransactionTotalsResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .build();
    }
}
