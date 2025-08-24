package com.exence.finance.modules.transaction.service;

import com.exence.finance.modules.transaction.dto.TransactionDTO;
import com.exence.finance.modules.transaction.dto.request.TransactionFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface TransactionService {
    public TransactionDTO getTransactionById(Long id);

    public Page<TransactionDTO> getTransactions(TransactionFilter filter, Pageable pageable);

    public TransactionDTO createTransaction(TransactionDTO transactionDTO);

    public TransactionDTO updateTransaction(TransactionDTO transactionDTO);

    public void deleteTransaction(Long id);
}
