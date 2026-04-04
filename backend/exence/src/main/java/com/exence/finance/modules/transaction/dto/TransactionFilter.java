package com.exence.finance.modules.transaction.dto;

import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MAX_LENGTH;

import com.exence.finance.common.annotations.ValidRange;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@ValidRange(from = "dateFrom", to = "dateTo")
@ValidRange(from = "amountFrom", to = "amountTo")
public record TransactionFilter(
        @Size(max = TRANSACTION_TITLE_MAX_LENGTH, message = "{validation.filter.keyword.size}") String keyword,
        LocalDate dateFrom,
        LocalDate dateTo,
        Long categoryId,
        TransactionType type,
        @DecimalMin(value = TRANSACTION_AMOUNT_MIN, message = "{validation.filter.amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.transaction.amount.digits}")
                BigDecimal amountFrom,
        @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.transaction.amount.digits}")
                BigDecimal amountTo,
        Boolean recurring) {}
