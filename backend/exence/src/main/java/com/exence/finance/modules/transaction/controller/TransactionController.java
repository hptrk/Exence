package com.exence.finance.modules.transaction.controller;

import com.exence.finance.common.dto.PageResponse;
import com.exence.finance.modules.transaction.dto.TransactionDTO;
import com.exence.finance.modules.transaction.dto.request.TransactionFilter;
import com.exence.finance.modules.transaction.dto.response.TransactionTotalsResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface TransactionController {
    ResponseEntity<TransactionDTO> getTransactionById(Long id);

    ResponseEntity<PageResponse<TransactionDTO>> getTransactions(TransactionFilter filter, Pageable pageable);

    ResponseEntity<TransactionDTO> createTransaction(TransactionDTO transactionDTO);

    ResponseEntity<TransactionDTO> updateTransaction(Long id, TransactionDTO transactionDTO);

    ResponseEntity<Void> deleteTransaction(Long id);

    ResponseEntity<TransactionTotalsResponse> getTransactionTotals();
}
