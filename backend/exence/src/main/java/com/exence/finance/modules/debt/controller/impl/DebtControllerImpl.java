package com.exence.finance.modules.debt.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.debt.controller.DebtController;
import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtGetDTO;
import com.exence.finance.modules.debt.dto.DebtPatchDTO;
import com.exence.finance.modules.debt.dto.DebtPaymentDTO;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import com.exence.finance.modules.debt.service.DebtService;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;
import com.exence.finance.modules.statistics.service.DebtWidgetService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/debts")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class DebtControllerImpl implements DebtController {

    private final DebtService debtService;
    private final DebtWidgetService debtWidgetService;

    @GetMapping
    public ResponseEntity<List<DebtGetDTO>> getDebts(
            @RequestParam(value = "statuses", required = false) List<DebtStatus> statuses,
            @RequestParam(value = "type", required = false) DebtType type) {
        return ResponseFactory.ok(debtService.getDebts(statuses, type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DebtGetDTO> getDebtById(@PathVariable Long id) {
        return ResponseFactory.ok(debtService.getDebtById(id));
    }

    @PostMapping
    public ResponseEntity<DebtGetDTO> createDebt(@Valid @RequestBody DebtCreateDTO dto) {
        DebtGetDTO created = debtService.createDebt(dto);
        return ResponseFactory.created(created.id(), created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DebtGetDTO> patchDebt(@PathVariable Long id, @Valid @RequestBody DebtPatchDTO dto) {
        return ResponseFactory.ok(debtService.patchDebt(id, dto));
    }

    @PatchMapping("/{id}/payment")
    public ResponseEntity<DebtGetDTO> makePayment(@PathVariable Long id, @Valid @RequestBody DebtPaymentDTO dto) {
        return ResponseFactory.ok(debtService.makePayment(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebt(@PathVariable Long id) {
        debtService.deleteDebt(id);
        return ResponseFactory.noContent();
    }

    @Override
    @GetMapping("/statistics/{type}")
    public ResponseEntity<DebtWidgetDataResponse> getWidgetData(@PathVariable DebtWidgetType type) {
        return ResponseFactory.ok(debtWidgetService.getWidgetData(type));
    }
}
