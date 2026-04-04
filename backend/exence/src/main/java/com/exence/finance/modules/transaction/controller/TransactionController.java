package com.exence.finance.modules.transaction.controller;

import com.exence.finance.common.dto.PageResponse;
import com.exence.finance.modules.transaction.dto.TransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.TransactionFilter;
import com.exence.finance.modules.transaction.dto.TransactionGetDTO;
import com.exence.finance.modules.transaction.dto.TransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionTotalsResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface TransactionController {
    ResponseEntity<TransactionGetDTO> getTransactionById(Long id);

    ResponseEntity<PageResponse<TransactionGetDTO>> getTransactions(TransactionFilter filter, Pageable pageable);

    ResponseEntity<TransactionGetDTO> createTransaction(TransactionCreateDTO transactionCreateDTO);

    ResponseEntity<TransactionGetDTO> updateTransaction(Long id, TransactionPatchDTO transactionPatchDTO);

    ResponseEntity<Void> deleteTransaction(Long id);

    ResponseEntity<TransactionTotalsResponse> getTransactionTotals();
}
