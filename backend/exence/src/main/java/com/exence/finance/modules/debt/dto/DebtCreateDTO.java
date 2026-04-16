package com.exence.finance.modules.debt.dto;

import static com.exence.finance.common.util.ValidationConstants.DEBT_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.DEBT_COUNTERPARTY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.DEBT_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.debt.enums.DebtType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(title = "Debt Create DTO", description = "Data required to create a new debt entry.")
public record DebtCreateDTO(
        @Schema(description = "Title of the debt. Must be a maximum of 100 characters long.", example = "Car Loan")
                @NotBlank(message = "{validation.debt.title.not-blank}")
                @Size(max = DEBT_TITLE_MAX_LENGTH, message = "{validation.debt.title.size}")
                String title,
        @Schema(
                        description =
                                "Name of the counterparty involved in the debt. Must be a maximum of 100 characters long.",
                        example = "John Doe")
                @NotBlank(message = "{validation.debt.counterparty-name.not-blank}")
                @Size(max = DEBT_COUNTERPARTY_NAME_MAX_LENGTH, message = "{validation.debt.counterparty-name.size}")
                String counterpartyName,
        @Schema(
                        description =
                                "Original amount of the debt. Must be a positive number with up to 10 integer digits and 2"
                                        + " fraction digits.",
                        example = "15000.00")
                @NotNull(message = "{validation.debt.original-amount.not-null}")
                @DecimalMin(value = DEBT_AMOUNT_MIN, message = "{validation.debt.original-amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.debt.original-amount.digits}")
                BigDecimal originalAmount,
        @Schema(description = "Currency of the debt. Must be a valid supported currency code.", example = "USD")
                @NotNull(message = "{validation.debt.currency.not-null}")
                SupportedCurrency currency,
        @Schema(
                        description = "Deadline for repaying the debt. Must be a valid date in the format YYYY-MM-DD.",
                        example = "2026-12-31")
                LocalDate deadline,
        @Schema(
                        description =
                                "Type of the debt. Must be either 'LENT' or 'BORROWED'. 'LENT' indicates that the workspace has"
                                        + " lent money to someone else, while 'BORROWED' indicates that the workspace has borrowed"
                                        + " money from someone else.",
                        example = "LENT")
                @NotNull(message = "{validation.debt.type.not-null}")
                DebtType type,
        @Schema(
                        description =
                                "ID of the category to which the debt belongs. Must be a valid category ID that exists in the"
                                        + " system.",
                        example = "1")
                @NotNull(message = "{validation.debt.category.not-null}")
                Long categoryId) {}
