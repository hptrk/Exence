package com.exence.finance.modules.transaction.controller.impl;

import com.exence.finance.modules.transaction.controller.TransactionController;
import com.exence.finance.modules.transaction.dto.request.CreateTransactionRequest;
import com.exence.finance.modules.transaction.dto.request.DeleteTransactionRequest;
import com.exence.finance.modules.transaction.dto.request.TransactionIdRequest;
import com.exence.finance.modules.transaction.dto.request.UpdateTransactionRequest;
import com.exence.finance.modules.transaction.dto.response.CreateTransactionResponse;
import com.exence.finance.modules.transaction.dto.response.EmptyTransactionResponse;
import com.exence.finance.modules.transaction.dto.response.TransactionResponse;
import com.exence.finance.modules.transaction.service.impl.TransactionServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class TransactionControllerImpl implements TransactionController {
    private final TransactionServiceImpl transactionService;

    @PostMapping("/getTransaction")
    public TransactionResponse getTransaction(TransactionIdRequest request){
        TransactionResponse response = transactionService.getTransaction(request);
        return response;
    }

    @PostMapping("/createTransaction")
    public CreateTransactionResponse createTransaction(CreateTransactionRequest request) {
        CreateTransactionResponse response = transactionService.createTransaction(request);
        return response;
    }

    @PostMapping("/updateTransaction")
    public TransactionResponse updateTransaction(UpdateTransactionRequest request) {
        TransactionResponse response = transactionService.updateTransaction(request);
        return response;
    }

    @PostMapping("/deleteTransaction")
    public EmptyTransactionResponse deleteTransaction(DeleteTransactionRequest request) {
        EmptyTransactionResponse response = transactionService.deleteTransaction(request);
        return response;
    }

}
