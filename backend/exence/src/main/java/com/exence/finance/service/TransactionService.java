package com.exence.finance.service;

import com.exence.finance.dto.TransactionDTO;
import com.exence.finance.exception.CategoryNotFoundException;
import com.exence.finance.exception.TransactionNotFoundException;
import com.exence.finance.exception.UserNotFoundException;
import com.exence.finance.model.Category;
import com.exence.finance.model.Transaction;
import com.exence.finance.model.User;
import com.exence.finance.repository.CategoryRepository;
import com.exence.finance.repository.TransactionRepository;
import com.exence.finance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<TransactionDTO> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id).orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));
        return convertToDTO(transaction);
    }

    public List<TransactionDTO> getTransactionsByUserId(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO createTransaction(TransactionDTO transactionDTO, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        Transaction transaction = convertToEntity(transactionDTO);
        transaction.setUser(user);
        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDTO(savedTransaction);
    }

    public TransactionDTO updateTransaction(Long id, TransactionDTO transactionDTO) {
        Transaction transaction = transactionRepository.findById(id).orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));
        transaction.setTitle(transactionDTO.getTitle());
        transaction.setDate(transactionDTO.getDate());
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setRecurring(transactionDTO.getRecurring());
        transaction.setType(transactionDTO.getType());
        transaction.setCategory(categoryRepository.findById(transactionDTO.getCategoryId()).orElseThrow(() -> new CategoryNotFoundException("Category not found")));
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return convertToDTO(updatedTransaction);
    }

    public TransactionDTO changeTransactionCategory(Long transactionId, Long newCategoryId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));
        Category newCategory = categoryRepository.findById(newCategoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        transaction.setCategory(newCategory);
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return convertToDTO(updatedTransaction);
    }

    public TransactionDTO patchTransaction(Long id, Map<String, Object> updates) {
        Transaction transaction = transactionRepository.findById(id).orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));
        updates.forEach((key, value) -> {
            Field field = ReflectionUtils.findField(Transaction.class, key);
            field.setAccessible(true);
            ReflectionUtils.setField(field, transaction, value);
        });
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return convertToDTO(updatedTransaction);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .title(transaction.getTitle())
                .date(transaction.getDate())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .recurring(transaction.getRecurring())
                .categoryId(transaction.getCategory().getId())
                .build();
    }

    private Transaction convertToEntity(TransactionDTO transactionDTO) {
        return Transaction.builder()
                .title(transactionDTO.getTitle())
                .date(transactionDTO.getDate())
                .amount(transactionDTO.getAmount())
                .type(transactionDTO.getType())
                .recurring(transactionDTO.getRecurring())
                .category(categoryRepository.findById(transactionDTO.getCategoryId()).orElseThrow(() -> new CategoryNotFoundException("Category not found")))
                .build();
    }
}
