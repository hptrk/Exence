package com.exence.finance.modules.transaction.dto;

import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_NOTE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MIN_LENGTH;

import com.exence.finance.common.dto.SupportedCurrency;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(title = "Transaction Patch DTO", description = "For updating an existing transaction. All fields are optional.")
public record TransactionPatchDTO(
        @Schema(description = "Title of the transaction", example = "Grocery shopping at the market")
                @Size(
                        min = TRANSACTION_TITLE_MIN_LENGTH,
                        max = TRANSACTION_TITLE_MAX_LENGTH,
                        message = "{validation.transaction.title.size}")
                String title,
        @Schema(
                        description = "Additional notes about the transaction",
                        example = "Bought fruits, vegetables and snacks")
                @Size(max = TRANSACTION_NOTE_MAX_LENGTH, message = "{validation.transaction.note.size}")
                String note,
        @Schema(description = "Date of the transaction", example = "2026-06-14") LocalDate date,
        @Schema(description = "Amount of the transaction", example = "16200.00")
                @DecimalMin(value = TRANSACTION_AMOUNT_MIN, message = "{validation.transaction.amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.transaction.amount.digits}")
                BigDecimal amount,
        @Schema(description = "Type of the transaction.", example = "EXPENSE") TransactionType type,
        @Schema(description = "ID of the category associated with the transaction", example = "2") Long categoryId,
        @Schema(description = "Currency of the transaction.", example = "HUF") SupportedCurrency currency,
        @Schema(description = "Exchange rate to the base currency", example = "0.0027")
                @DecimalMin(value = "0.0000000001", message = "{validation.transaction.exchange-rate.min}")
                BigDecimal exchangeRate) {}
