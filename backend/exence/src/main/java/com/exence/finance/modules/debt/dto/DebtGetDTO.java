package com.exence.finance.modules.debt.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import java.math.BigDecimal;
import java.time.LocalDate;

public record DebtGetDTO(
        Long id,
        String title,
        String counterpartyName,
        BigDecimal originalAmount,
        BigDecimal remainingAmount,
        BigDecimal originalBaseCurrencyAmount,
        BigDecimal remainingBaseCurrencyAmount,
        SupportedCurrency currency,
        LocalDate deadline,
        DebtType type,
        DebtStatus status,
        Long categoryId,
        BigDecimal paidPercentage) {}
