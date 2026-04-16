package com.exence.finance.modules.transaction.dto;

import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MAX_LENGTH;

import com.exence.finance.common.annotations.ValidRange;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(title = "Transaction Filter DTO", description = "Used for filtering transactions based on various criteria.")
@ValidRange(from = "dateFrom", to = "dateTo")
@ValidRange(from = "amountFrom", to = "amountTo")
public record TransactionFilter(
        @Schema(description = "Keyword to search in transaction titles", example = "Grocery")
                @Size(max = TRANSACTION_TITLE_MAX_LENGTH, message = "{validation.filter.keyword.size}")
                String keyword,
        @Schema(description = "Start date for filtering transactions", example = "2026-01-01") LocalDate dateFrom,
        @Schema(description = "End date for filtering transactions", example = "2026-12-31") LocalDate dateTo,
        @Schema(description = "ID of the category to filter transactions", example = "1") Long categoryId,
        @Schema(description = "Type of transactions to filter", example = "EXPENSE") TransactionType type,
        @Schema(description = "Minimum amount for filtering transactions", example = "1000.00")
                @DecimalMin(value = TRANSACTION_AMOUNT_MIN, message = "{validation.filter.amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.transaction.amount.digits}")
                BigDecimal amountFrom,
        @Schema(description = "Maximum amount for filtering transactions", example = "5000.00")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.transaction.amount.digits}")
                BigDecimal amountTo,
        @Schema(
                        description = "Whether to include transactions created by recurring jobs in the filter results",
                        example = "false")
                Boolean createdByRecurringJob) {}
