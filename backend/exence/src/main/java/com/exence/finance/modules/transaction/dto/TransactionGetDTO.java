package com.exence.finance.modules.transaction.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(title = "Transaction Get DTO", description = "Used for retrieving transaction details.")
public record TransactionGetDTO(
        @Schema(description = "Unique identifier of the transaction.", example = "1") Long id,
        @Schema(description = "Title of the transaction", example = "Grocery shopping") String title,
        @Schema(description = "Additional notes about the transaction", example = "Bought fruits and vegetables")
                String note,
        @Schema(description = "Date of the transaction", example = "2026-06-15") LocalDate date,
        @Schema(description = "Amount of the transaction", example = "15630.00") BigDecimal amount,
        @Schema(description = "Type of the transaction.", example = "EXPENSE") TransactionType type,
        @Schema(description = "Whether the transaction was created by a recurring job", example = "false")
                Boolean createdByRecurringJob,
        @Schema(description = "ID of the recurring transaction if applicable", example = "1")
                Long recurringTransactionId,
        @Schema(description = "ID of the category associated with the transaction", example = "1") Long categoryId,
        @Schema(description = "Currency of the transaction.", example = "HUF") SupportedCurrency currency,
        @Schema(description = "Exchange rate to the base currency", example = "0.0027") BigDecimal exchangeRate,
        @Schema(description = "Amount of the transaction converted to the base currency", example = "42.20")
                BigDecimal baseCurrencyAmount) {}
