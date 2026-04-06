package com.exence.finance.modules.debt.dto;

import static com.exence.finance.common.util.ValidationConstants.DEBT_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.DEBT_COUNTERPARTY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.DEBT_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.debt.enums.DebtType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record DebtCreateDTO(
        @NotBlank(message = "{validation.debt.title.not-blank}")
                @Size(max = DEBT_TITLE_MAX_LENGTH, message = "{validation.debt.title.size}")
                String title,
        @NotBlank(message = "{validation.debt.counterparty-name.not-blank}")
                @Size(max = DEBT_COUNTERPARTY_NAME_MAX_LENGTH, message = "{validation.debt.counterparty-name.size}")
                String counterpartyName,
        @NotNull(message = "{validation.debt.original-amount.not-null}")
                @DecimalMin(value = DEBT_AMOUNT_MIN, message = "{validation.debt.original-amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.debt.original-amount.digits}")
                BigDecimal originalAmount,
        @NotNull(message = "{validation.debt.currency.not-null}") SupportedCurrency currency,
        LocalDate deadline,
        @NotNull(message = "{validation.debt.type.not-null}") DebtType type,
        @NotNull(message = "{validation.debt.category.not-null}") Long categoryId) {}
