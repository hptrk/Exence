package com.exence.finance.modules.transaction.controller;

import com.exence.finance.common.dto.PageResponse;
import com.exence.finance.modules.transaction.dto.RecurringTransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionGetDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionPatchDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface RecurringTransactionController {

    ResponseEntity<RecurringTransactionGetDTO> getById(Long id);

    ResponseEntity<PageResponse<RecurringTransactionGetDTO>> getAll(Pageable pageable);

    ResponseEntity<RecurringTransactionGetDTO> create(RecurringTransactionCreateDTO dto);

    ResponseEntity<RecurringTransactionGetDTO> update(Long id, RecurringTransactionPatchDTO dto);

    ResponseEntity<Void> delete(Long id);
}
