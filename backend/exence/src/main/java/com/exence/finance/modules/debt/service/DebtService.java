package com.exence.finance.modules.debt.service;

import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtGetDTO;
import com.exence.finance.modules.debt.dto.DebtPatchDTO;
import com.exence.finance.modules.debt.dto.DebtPaymentDTO;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import java.util.List;

public interface DebtService {

    List<DebtGetDTO> getDebts(List<DebtStatus> statuses, DebtType type);

    DebtGetDTO getDebtById(Long id);

    DebtGetDTO createDebt(DebtCreateDTO dto);

    DebtGetDTO patchDebt(Long id, DebtPatchDTO dto);

    DebtGetDTO makePayment(Long id, DebtPaymentDTO dto);

    void deleteDebt(Long id);

    int expireOverdueDebts();
}
