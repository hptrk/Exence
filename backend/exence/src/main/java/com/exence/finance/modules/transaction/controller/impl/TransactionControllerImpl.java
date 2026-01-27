package com.exence.finance.modules.transaction.controller.impl;

import static com.exence.finance.common.util.ApplicationConstants.DEFAULT_PAGE_SIZE;

import com.exence.finance.common.dto.PageResponse;
import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.transaction.controller.TransactionController;
import com.exence.finance.modules.transaction.dto.TransactionDTO;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.dto.request.TransactionFilter;
import com.exence.finance.modules.transaction.dto.response.RecurringTransactionsResponse;
import com.exence.finance.modules.transaction.dto.response.TransactionTotalsResponse;
import com.exence.finance.modules.transaction.entity.Transaction;
import com.exence.finance.modules.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class TransactionControllerImpl implements TransactionController {
    private final TransactionService transactionService;

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable("id") Long id) {
        TransactionDTO transactionDTO = transactionService.getTransactionById(id);
        return ResponseFactory.ok(transactionDTO);
    }

    @GetMapping()
    public ResponseEntity<PageResponse<TransactionDTO>> getTransactions(
            @Valid @ModelAttribute TransactionFilter filter,
            @PageableDefault(size = DEFAULT_PAGE_SIZE, sort = Transaction.Fields.date, direction = Sort.Direction.DESC)
                    Pageable pageable) {
        Page<TransactionDTO> page = transactionService.getTransactions(filter, pageable);
        return ResponseFactory.page(page);
    }

    @GetMapping("/income")
    public ResponseEntity<PageResponse<TransactionDTO>> getIncomes(
            @Valid @ModelAttribute TransactionFilter filter,
            @PageableDefault(size = DEFAULT_PAGE_SIZE, sort = Transaction.Fields.date, direction = Sort.Direction.DESC)
                    Pageable pageable) {
        TransactionFilter incomeFilter = filter != null ? filter : new TransactionFilter();
        incomeFilter.setType(TransactionType.INCOME);
        Page<TransactionDTO> page = transactionService.getTransactions(incomeFilter, pageable);
        return ResponseFactory.page(page);
    }

    @GetMapping("/expense")
    public ResponseEntity<PageResponse<TransactionDTO>> getExpenses(
            @Valid @ModelAttribute TransactionFilter filter,
            @PageableDefault(size = DEFAULT_PAGE_SIZE, sort = Transaction.Fields.date, direction = Sort.Direction.DESC)
                    Pageable pageable) {
        TransactionFilter expenseFilter = filter != null ? filter : new TransactionFilter();
        expenseFilter.setType(TransactionType.EXPENSE);
        Page<TransactionDTO> page = transactionService.getTransactions(expenseFilter, pageable);
        return ResponseFactory.page(page);
    }

    @GetMapping("/recurring")
    public ResponseEntity<RecurringTransactionsResponse> getRecurringTransactions(
            @PageableDefault(size = DEFAULT_PAGE_SIZE, sort = Transaction.Fields.date, direction = Sort.Direction.DESC)
                    Pageable pageable) {
        RecurringTransactionsResponse response = transactionService.getRecurringTransactions(pageable);
        return ResponseFactory.ok(response);
    }

    @PostMapping()
    public ResponseEntity<TransactionDTO> createTransaction(@Valid @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO created = transactionService.createTransaction(transactionDTO);
        return ResponseFactory.created(created.getId(), created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @PathVariable Long id, @Valid @RequestBody TransactionDTO transactionDTO) {
        transactionDTO.setId(id);
        TransactionDTO updated = transactionService.updateTransaction(transactionDTO);
        return ResponseFactory.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable("id") Long id) {
        transactionService.deleteTransaction(id);
        return ResponseFactory.noContent();
    }

    @GetMapping("/totals")
    public ResponseEntity<TransactionTotalsResponse> getTransactionTotals() {
        TransactionTotalsResponse response = transactionService.getTransactionTotals();
        return ResponseFactory.ok(response);
    }
}
