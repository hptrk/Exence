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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(title = "Transaction Create DTO", description = "Data required to create a new transaction.")
public record TransactionCreateDTO(
        @Schema(description = "Title of the transaction", example = "Grocery shopping")
                @NotBlank(message = "{validation.transaction.title.not-blank}")
                @Size(
                        min = TRANSACTION_TITLE_MIN_LENGTH,
                        max = TRANSACTION_TITLE_MAX_LENGTH,
                        message = "{validation.transaction.title.size}")
                String title,
        @Schema(description = "Additional notes about the transaction", example = "Bought fruits and vegetables")
                @Size(max = TRANSACTION_NOTE_MAX_LENGTH, message = "{validation.transaction.note.size}")
                String note,
        @Schema(description = "Date of the transaction", example = "2026-06-15")
                @NotNull(message = "{validation.transaction.date.not-null}")
                LocalDate date,
        @Schema(description = "Amount of the transaction", example = "15630.00")
                @NotNull(message = "{validation.transaction.amount.not-null}")
                @DecimalMin(value = TRANSACTION_AMOUNT_MIN, message = "{validation.transaction.amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.transaction.amount.digits}")
                BigDecimal amount,
        @Schema(description = "Type of the transaction.", example = "EXPENSE")
                @NotNull(message = "{validation.transaction.type.not-null}")
                TransactionType type,
        @Schema(description = "ID of the category associated with the transaction", example = "1")
                @NotNull(message = "{validation.transaction.category.not-null}")
                Long categoryId,
        @Schema(description = "Currency of the transaction.", example = "HUF") SupportedCurrency currency,
        @Schema(description = "Exchange rate to the base currency", example = "0.0027")
                @DecimalMin(value = "0.0000000001", message = "{validation.transaction.exchange-rate.min}")
                BigDecimal exchangeRate) {}
