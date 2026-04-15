package com.exence.finance.modules.debt.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(
        title = "Debt Get DTO",
        description =
                "Used for retrieving debt information. Contains all relevant details about a debt entry, including"
                        + " calculated fields such as remaining amounts and paid percentage.")
public record DebtGetDTO(
        @Schema(description = "Unique identifier of the debt entry.", example = "1") Long id,
        @Schema(description = "Title of the debt.", example = "Car Loan") String title,
        @Schema(description = "Name of the counterparty involved in the debt.", example = "John Doe")
                String counterpartyName,
        @Schema(description = "Original amount of the debt.", example = "15000.00") BigDecimal originalAmount,
        @Schema(
                        description =
                                "Remaining amount of the debt. Calculated as original amount minus any payments made.",
                        example = "5000.00")
                BigDecimal remainingAmount,
        @Schema(
                        description =
                                "Original amount of the debt converted to the base currency. Calculated using the exchange"
                                        + " rate at the time of debt creation.",
                        example = "15000.00")
                BigDecimal originalBaseCurrencyAmount,
        @Schema(
                        description =
                                "Remaining amount of the debt converted to the base currency. Calculated using the exchange"
                                        + " rate at the time of debt creation and any payments made.",
                        example = "5000.00")
                BigDecimal remainingBaseCurrencyAmount,
        @Schema(description = "Currency of the debt.", example = "USD") SupportedCurrency currency,
        @Schema(description = "Deadline for repaying the debt.", example = "2026-12-31") LocalDate deadline,
        @Schema(
                        description =
                                "Type of the debt. Must be either 'LENT' or 'BORROWED'. 'LENT' indicates that the workspace has"
                                        + " lent money to someone else, while 'BORROWED' indicates that the workspace has borrowed"
                                        + " money from someone else.",
                        example = "LENT")
                DebtType type,
        @Schema(
                        description =
                                "Status of the debt. Must be one of 'ACTIVE', 'SETTLED', 'EXPIRED', or 'FORGIVEN'. 'ACTIVE'"
                                        + " indicates that the debt is currently active and has not been fully repaid. 'SETTLED'"
                                        + " indicates that the debt has been fully repaid. 'EXPIRED' indicates that the deadline"
                                        + " for repaying the debt has passed without full repayment. 'FORGIVEN' indicates that the"
                                        + " debt has been forgiven and no repayment is expected.",
                        example = "ACTIVE")
                DebtStatus status,
        @Schema(description = "ID of the category associated with the debt.", example = "1") Long categoryId,
        @Schema(
                        description =
                                "Percentage of the original amount that has been paid. Calculated as (original amount -"
                                        + " remaining amount) / original amount * 100.",
                        example = "66.67")
                BigDecimal paidPercentage) {}
