package com.exence.finance.modules.debt.dto;

import static com.exence.finance.common.util.ValidationConstants.DEBT_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record DebtPaymentDTO(
        @NotNull(message = "{validation.debt.payment-amount.not-null}")
                @DecimalMin(value = DEBT_AMOUNT_MIN, message = "{validation.debt.payment-amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.debt.payment-amount.digits}")
                BigDecimal amount) {}
