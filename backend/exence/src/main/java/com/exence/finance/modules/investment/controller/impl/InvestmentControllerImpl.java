package com.exence.finance.modules.investment.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.investment.controller.InvestmentController;
import com.exence.finance.modules.investment.dto.InvestmentCreateDTO;
import com.exence.finance.modules.investment.dto.InvestmentGetDTO;
import com.exence.finance.modules.investment.dto.InvestmentGroupDTO;
import com.exence.finance.modules.investment.dto.InvestmentPatchDTO;
import com.exence.finance.modules.investment.service.InvestmentService;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import com.exence.finance.modules.statistics.service.InvestmentWidgetService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/investments")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class InvestmentControllerImpl implements InvestmentController {

    private final InvestmentService investmentService;
    private final InvestmentWidgetService investmentWidgetService;

    @Override
    @GetMapping
    public ResponseEntity<List<InvestmentGetDTO>> getInvestments() {
        return ResponseFactory.ok(investmentService.getInvestments());
    }

    @Override
    @GetMapping("/grouped")
    public ResponseEntity<List<InvestmentGroupDTO>> getGroupedInvestments() {
        return ResponseFactory.ok(investmentService.getGroupedInvestments());
    }

    @Override
    @PostMapping
    public ResponseEntity<InvestmentGetDTO> createInvestment(@Valid @RequestBody InvestmentCreateDTO dto) {
        InvestmentGetDTO created = investmentService.createInvestment(dto);
        return ResponseFactory.created(created.id(), created);
    }

    @Override
    @PatchMapping("/{id}")
    public ResponseEntity<InvestmentGetDTO> patchInvestment(
            @PathVariable Long id, @Valid @RequestBody InvestmentPatchDTO dto) {
        return ResponseFactory.ok(investmentService.patchInvestment(id, dto));
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvestment(@PathVariable Long id) {
        investmentService.deleteInvestment(id);
        return ResponseFactory.noContent();
    }

    @Override
    @GetMapping("/statistics/{type}")
    public ResponseEntity<InvestmentWidgetDataResponse> getWidgetData(@PathVariable InvestmentWidgetType type) {
        return ResponseFactory.ok(investmentWidgetService.getWidgetData(type));
    }
}
