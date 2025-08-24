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
import com.exence.finance.modules.transaction.dto.request.TransactionFilter;
import com.exence.finance.modules.transaction.entity.Transaction;
import com.exence.finance.modules.transaction.mapper.TransactionMapper;
import com.exence.finance.modules.transaction.repository.TransactionRepository;
import com.exence.finance.modules.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService{
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final TransactionMapper transactionMapper;

    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id).orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));

        return transactionMapper.mapToTransactionDTO(transaction);
    }

    public Page<TransactionDTO> getTransactions(TransactionFilter filter, Pageable pageable){
        // TODO: Implement filtering logic based on request parameters

        return Page.empty(pageable);
    }

    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        Long userId = userService.getUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));

        Category category = categoryRepository.findById(transactionDTO.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        Transaction transaction = transactionMapper.mapToTransaction(transactionDTO);
        transaction.setCategory(category);
        transaction.setUser(user);
        Transaction savedTransaction = transactionRepository.save(transaction);

        return transactionMapper.mapToTransactionDTO(savedTransaction);
    }

    public TransactionDTO updateTransaction(TransactionDTO transactionDTO) {
        Transaction transaction = transactionRepository.findById(transactionDTO.getId())
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));

        Category category = categoryRepository.findById(transactionDTO.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        transactionMapper.updateTransactionFromDto(transactionDTO, transaction);
        transaction.setCategory(category);
        Transaction savedTransaction = transactionRepository.save(transaction);

        return transactionMapper.mapToTransactionDTO(savedTransaction);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
