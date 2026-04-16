package com.exence.finance.modules.transaction.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(
        title = "Transaction Totals Response DTO",
        description = "Response containing total income and total expense amounts for a given set of transactions. Both"
                + " totals are represented as BigDecimal values to ensure precision in financial calculations.")
public record TransactionTotalsResponse(
        @Schema(description = "Total income amount calculated from the transactions", example = "152400.00")
                BigDecimal totalIncome,
        @Schema(description = "Total expense amount calculated from the transactions", example = "57330.00")
                BigDecimal totalExpense) {}
