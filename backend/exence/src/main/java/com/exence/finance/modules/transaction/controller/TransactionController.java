package com.exence.finance.modules.transaction.controller;

import com.exence.finance.modules.transaction.dto.request.CreateTransactionRequest;
import com.exence.finance.modules.transaction.dto.request.DeleteTransactionRequest;
import com.exence.finance.modules.transaction.dto.request.TransactionIdRequest;
import com.exence.finance.modules.transaction.dto.request.UpdateTransactionRequest;
import com.exence.finance.modules.transaction.dto.response.CreateTransactionResponse;
import com.exence.finance.modules.transaction.dto.response.EmptyTransactionResponse;
import com.exence.finance.modules.transaction.dto.response.TransactionResponse;

public interface TransactionController {
    public TransactionResponse getTransaction(TransactionIdRequest request);

    public CreateTransactionResponse createTransaction(CreateTransactionRequest request);

    public TransactionResponse updateTransaction(UpdateTransactionRequest request);

    public EmptyTransactionResponse deleteTransaction(DeleteTransactionRequest request);
}
