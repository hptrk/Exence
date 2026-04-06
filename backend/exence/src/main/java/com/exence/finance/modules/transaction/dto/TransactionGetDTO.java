package com.exence.finance.modules.transaction.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionGetDTO(
        Long id,
        String title,
        String note,
        LocalDate date,
        BigDecimal amount,
        TransactionType type,
        Boolean createdByRecurringJob,
        Long recurringTransactionId,
        Long categoryId,
        SupportedCurrency currency,
        BigDecimal exchangeRate,
        BigDecimal baseCurrencyAmount) {}
