package com.exence.finance.modules.investment.dto;

import com.exence.finance.modules.investment.enums.InvestmentType;
import java.math.BigDecimal;
import java.util.List;

public record InvestmentGroupDTO(
        String name,
        long daysSinceLastAction,
        BigDecimal totalInvested,
        InvestmentType type,
        int purchasesCount,
        List<InvestmentGetDTO> purchases) {}
