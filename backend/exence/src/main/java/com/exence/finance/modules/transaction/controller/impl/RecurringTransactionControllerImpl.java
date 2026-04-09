package com.exence.finance.modules.transaction.controller.impl;

import static com.exence.finance.common.util.ApplicationConstants.DEFAULT_PAGE_SIZE;

import com.exence.finance.common.dto.PageResponse;
import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.transaction.controller.RecurringTransactionController;
import com.exence.finance.modules.transaction.dto.RecurringTransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionGetDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.RecurringTransaction;
import com.exence.finance.modules.transaction.service.RecurringTransactionService;
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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions/recurring")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class RecurringTransactionControllerImpl implements RecurringTransactionController {

    private final RecurringTransactionService recurringTransactionService;

    @GetMapping("/{id}")
    public ResponseEntity<RecurringTransactionGetDTO> getById(@PathVariable Long id) {
        return ResponseFactory.ok(recurringTransactionService.getById(id));
    }

    @GetMapping
    public ResponseEntity<PageResponse<RecurringTransactionGetDTO>> getAll(
            @PageableDefault(
                            size = DEFAULT_PAGE_SIZE,
                            sort = RecurringTransaction.Fields.nextExecutionDate,
                            direction = Sort.Direction.ASC)
                    Pageable pageable,
            @RequestParam(required = false) TransactionType type) {
        Page<RecurringTransactionGetDTO> page = recurringTransactionService.getAll(pageable, type);
        return ResponseFactory.page(page);
    }

    @PostMapping
    public ResponseEntity<RecurringTransactionGetDTO> create(@Valid @RequestBody RecurringTransactionCreateDTO dto) {
        RecurringTransactionGetDTO created = recurringTransactionService.create(dto);
        return ResponseFactory.created(created.id(), created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RecurringTransactionGetDTO> update(
            @PathVariable Long id, @Valid @RequestBody RecurringTransactionPatchDTO dto) {
        return ResponseFactory.ok(recurringTransactionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recurringTransactionService.delete(id);
        return ResponseFactory.noContent();
    }
}
