package com.exence.finance.modules.transaction.service.impl;

import com.exence.finance.common.exception.CategoryNotFoundException;
import com.exence.finance.common.exception.TransactionNotFoundException;
import com.exence.finance.common.exception.UserNotFoundException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.transaction.dto.TransactionDTO;
import com.exence.finance.modules.transaction.dto.request.CreateTransactionRequest;
import com.exence.finance.modules.transaction.dto.request.DeleteTransactionRequest;
import com.exence.finance.modules.transaction.dto.request.TransactionIdRequest;
import com.exence.finance.modules.transaction.dto.request.UpdateTransactionRequest;
import com.exence.finance.modules.transaction.dto.response.CreateTransactionResponse;
import com.exence.finance.modules.transaction.dto.response.EmptyTransactionResponse;
import com.exence.finance.modules.transaction.dto.response.TransactionResponse;
import com.exence.finance.modules.transaction.entity.Transaction;
import com.exence.finance.modules.transaction.mapper.TransactionMapper;
import com.exence.finance.modules.transaction.repository.TransactionRepository;
import com.exence.finance.modules.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService{
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final TransactionMapper transactionMapper;

    public TransactionResponse getTransaction(TransactionIdRequest request) {
        Transaction transaction = transactionRepository.findById(request.getId()).orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));

        return TransactionResponse.builder()
                .transaction(transactionMapper.mapToTransactionDTO(transaction))
                .build();
    }

    public CreateTransactionResponse createTransaction(CreateTransactionRequest request) {
        TransactionDTO transactionDTO = request.getTransaction();

        Long userId = userService.getUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));

        Category category = categoryRepository.findById(transactionDTO.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        Transaction transaction = transactionMapper.mapToTransaction(transactionDTO);
        transaction.setCategory(category);
        transaction.setUser(user);
        Transaction savedTransaction = transactionRepository.save(transaction);

        return CreateTransactionResponse.builder()
                .transaction(transactionMapper.mapToTransactionDTO(savedTransaction))
                .build();
    }

    public TransactionResponse updateTransaction(UpdateTransactionRequest request) {
        TransactionDTO transactionDTO = request.getTransaction();

        Transaction transaction = transactionRepository.findById(request.getTransaction().getId())
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));

        Category category = categoryRepository.findById(transactionDTO.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        transactionMapper.updateTransactionFromDto(transactionDTO, transaction);
        transaction.setCategory(category);
        Transaction savedTransaction = transactionRepository.save(transaction);

        return TransactionResponse.builder()
                .transaction(transactionMapper.mapToTransactionDTO(savedTransaction))
                .build();
    }

    public EmptyTransactionResponse deleteTransaction(DeleteTransactionRequest request) {
        transactionRepository.deleteById(request.getId());

        return EmptyTransactionResponse.builder()
                .build();
    }
}
