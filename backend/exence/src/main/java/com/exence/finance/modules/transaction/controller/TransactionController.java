package com.exence.finance.modules.transaction.controller;

import com.exence.finance.common.dto.PageResponse;
import com.exence.finance.modules.transaction.dto.TransactionDTO;
import com.exence.finance.modules.transaction.dto.request.TransactionFilter;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;


public interface TransactionController {
    public ResponseEntity<TransactionDTO> getTransactionById(Long id);

    public ResponseEntity<PageResponse<TransactionDTO>> getTransactions(TransactionFilter filter, Pageable pageable);

    public ResponseEntity<TransactionDTO> createTransaction(TransactionDTO transactionDTO);

    public ResponseEntity<TransactionDTO> updateTransaction(Long id, TransactionDTO transactionDTO);

    public ResponseEntity<Void> deleteTransaction(Long id);
}
