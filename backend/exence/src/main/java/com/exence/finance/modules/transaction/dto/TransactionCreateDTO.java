package com.exence.finance.modules.transaction.dto;

import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_NOTE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MIN_LENGTH;

import com.exence.finance.common.dto.SupportedCurrency;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionCreateDTO(
        @NotBlank(message = "{validation.transaction.title.not-blank}")
                @Size(
                        min = TRANSACTION_TITLE_MIN_LENGTH,
                        max = TRANSACTION_TITLE_MAX_LENGTH,
                        message = "{validation.transaction.title.size}")
                String title,
        @Size(max = TRANSACTION_NOTE_MAX_LENGTH, message = "{validation.transaction.note.size}") String note,
        @NotNull(message = "{validation.transaction.date.not-null}") LocalDate date,
        @NotNull(message = "{validation.transaction.amount.not-null}")
                @DecimalMin(value = TRANSACTION_AMOUNT_MIN, message = "{validation.transaction.amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.transaction.amount.digits}")
                BigDecimal amount,
        @NotNull(message = "{validation.transaction.type.not-null}") TransactionType type,
        Boolean recurring,
        @NotNull(message = "{validation.transaction.category.not-null}") Long categoryId,
        SupportedCurrency currency,
        @DecimalMin(value = "0.0000000001") BigDecimal exchangeRate,
        BigDecimal baseCurrencyAmount) {}
