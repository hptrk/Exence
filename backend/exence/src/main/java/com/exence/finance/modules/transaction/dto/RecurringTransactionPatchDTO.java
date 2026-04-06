package com.exence.finance.modules.transaction.dto;

import static com.exence.finance.common.util.ValidationConstants.RECURRING_DAY_OF_MONTH_MAX;
import static com.exence.finance.common.util.ValidationConstants.RECURRING_DAY_OF_MONTH_MIN;
import static com.exence.finance.common.util.ValidationConstants.RECURRING_INTERVAL_MIN;
import static com.exence.finance.common.util.ValidationConstants.RECURRING_MAX_OCCURRENCES_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_NOTE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MIN_LENGTH;

import com.exence.finance.common.dto.SupportedCurrency;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;

public record RecurringTransactionPatchDTO(
        @Size(
                        min = TRANSACTION_TITLE_MIN_LENGTH,
                        max = TRANSACTION_TITLE_MAX_LENGTH,
                        message = "{validation.transaction.title.size}")
                String title,
        @Size(max = TRANSACTION_NOTE_MAX_LENGTH, message = "{validation.transaction.note.size}") String note,
        @DecimalMin(value = TRANSACTION_AMOUNT_MIN, message = "{validation.transaction.amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.transaction.amount.digits}")
                BigDecimal amount,
        TransactionType type,
        Long categoryId,
        SupportedCurrency currency,
        RecurrenceFrequency frequency,
        @Min(value = RECURRING_INTERVAL_MIN, message = "{validation.recurring.interval.min}") Integer interval,
        DayOfWeek dayOfWeek,
        @Min(value = RECURRING_DAY_OF_MONTH_MIN, message = "{validation.recurring.day-of-month.min}")
                @Max(value = RECURRING_DAY_OF_MONTH_MAX, message = "{validation.recurring.day-of-month.max}")
                Integer dayOfMonth,
        EndCondition endCondition,
        LocalDate endDate,
        @Min(value = RECURRING_MAX_OCCURRENCES_MIN, message = "{validation.recurring.max-occurrences.min}")
                Integer maxOccurrences,
        Boolean active) {}
