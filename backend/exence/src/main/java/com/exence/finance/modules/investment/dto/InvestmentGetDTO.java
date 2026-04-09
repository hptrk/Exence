package com.exence.finance.modules.investment.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.investment.enums.InvestmentType;
import java.math.BigDecimal;
import java.time.LocalDate;

public record InvestmentGetDTO(
        Long id,
        String asset,
        LocalDate purchaseDate,
        InvestmentType type,
        BigDecimal amount,
        SupportedCurrency currency,
        BigDecimal baseCurrencyAmount,
        String note) {}
