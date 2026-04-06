package com.exence.finance.modules.transaction.service;

import com.exence.finance.modules.transaction.dto.RecurringTransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionGetDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionPatchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecurringTransactionService {

    RecurringTransactionGetDTO getById(Long id);

    Page<RecurringTransactionGetDTO> getAll(Pageable pageable);

    RecurringTransactionGetDTO create(RecurringTransactionCreateDTO dto);

    RecurringTransactionGetDTO update(Long id, RecurringTransactionPatchDTO dto);

    void delete(Long id);
}
