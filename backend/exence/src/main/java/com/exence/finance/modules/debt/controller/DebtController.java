package com.exence.finance.modules.debt.controller;

import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtGetDTO;
import com.exence.finance.modules.debt.dto.DebtPatchDTO;
import com.exence.finance.modules.debt.dto.DebtPaymentDTO;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface DebtController {

    ResponseEntity<List<DebtGetDTO>> getDebts(List<DebtStatus> statuses, DebtType type);

    ResponseEntity<DebtGetDTO> getDebtById(Long id);

    ResponseEntity<DebtGetDTO> createDebt(DebtCreateDTO dto);

    ResponseEntity<DebtGetDTO> patchDebt(Long id, DebtPatchDTO dto);

    ResponseEntity<DebtGetDTO> makePayment(Long id, DebtPaymentDTO dto);

    ResponseEntity<Void> deleteDebt(Long id);

    ResponseEntity<DebtWidgetDataResponse> getWidgetData(DebtWidgetType type);
}
