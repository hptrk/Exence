package com.exence.finance.modules.transaction.service;

import com.exence.finance.modules.transaction.dto.TransactionDTO;
import com.exence.finance.modules.transaction.dto.request.TransactionFilter;
import com.exence.finance.modules.transaction.dto.response.RecurringTransactionsResponse;
import com.exence.finance.modules.transaction.dto.response.TransactionTotalsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {
    TransactionDTO getTransactionById(Long id);

    Page<TransactionDTO> getTransactions(TransactionFilter filter, Pageable pageable);

    RecurringTransactionsResponse getRecurringTransactions(Pageable pageable);

    TransactionDTO createTransaction(TransactionDTO transactionDTO);

    TransactionDTO updateTransaction(TransactionDTO transactionDTO);

    void deleteTransaction(Long id);

    TransactionTotalsResponse getTransactionTotals();
}
