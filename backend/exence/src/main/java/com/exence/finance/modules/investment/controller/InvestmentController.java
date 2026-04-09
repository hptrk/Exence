package com.exence.finance.modules.investment.controller;

import com.exence.finance.modules.investment.dto.InvestmentCreateDTO;
import com.exence.finance.modules.investment.dto.InvestmentGetDTO;
import com.exence.finance.modules.investment.dto.InvestmentGroupDTO;
import com.exence.finance.modules.investment.dto.InvestmentPatchDTO;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface InvestmentController {

    ResponseEntity<List<InvestmentGetDTO>> getInvestments();

    ResponseEntity<List<InvestmentGroupDTO>> getGroupedInvestments();

    ResponseEntity<InvestmentGetDTO> createInvestment(InvestmentCreateDTO dto);

    ResponseEntity<InvestmentGetDTO> patchInvestment(Long id, InvestmentPatchDTO dto);

    ResponseEntity<Void> deleteInvestment(Long id);

    ResponseEntity<InvestmentWidgetDataResponse> getWidgetData(InvestmentWidgetType type);
}
