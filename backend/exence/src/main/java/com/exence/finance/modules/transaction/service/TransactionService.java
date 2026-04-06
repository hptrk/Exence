package com.exence.finance.modules.transaction.service;

import com.exence.finance.modules.transaction.dto.TransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.TransactionFilter;
import com.exence.finance.modules.transaction.dto.TransactionGetDTO;
import com.exence.finance.modules.transaction.dto.TransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionTotalsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {
    TransactionGetDTO getTransactionById(Long id);

    Page<TransactionGetDTO> getTransactions(TransactionFilter filter, Pageable pageable);

    TransactionGetDTO createTransaction(TransactionCreateDTO transactionCreateDTO);

    TransactionGetDTO updateTransaction(Long id, TransactionPatchDTO transactionPatchDTO);

    void deleteTransaction(Long id);

    TransactionTotalsResponse getTransactionTotals();
}
