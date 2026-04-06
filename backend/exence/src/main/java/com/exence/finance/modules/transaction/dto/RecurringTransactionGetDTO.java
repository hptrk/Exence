package com.exence.finance.modules.transaction.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;

public record RecurringTransactionGetDTO(
        Long id,
        String title,
        String note,
        BigDecimal amount,
        TransactionType type,
        Long categoryId,
        SupportedCurrency currency,
        RecurrenceFrequency frequency,
        Integer interval,
        DayOfWeek dayOfWeek,
        Integer dayOfMonth,
        EndCondition endCondition,
        LocalDate endDate,
        Integer maxOccurrences,
        Integer currentOccurrences,
        LocalDate nextExecutionDate,
        Boolean active) {}
