package com.exence.finance.modules.investment.service;

import com.exence.finance.modules.investment.dto.InvestmentCreateDTO;
import com.exence.finance.modules.investment.dto.InvestmentGetDTO;
import com.exence.finance.modules.investment.dto.InvestmentGroupDTO;
import com.exence.finance.modules.investment.dto.InvestmentPatchDTO;
import java.util.List;

public interface InvestmentService {

    List<InvestmentGetDTO> getInvestments();

    List<InvestmentGroupDTO> getGroupedInvestments();

    InvestmentGetDTO createInvestment(InvestmentCreateDTO dto);

    InvestmentGetDTO patchInvestment(Long id, InvestmentPatchDTO dto);

    void deleteInvestment(Long id);
}
