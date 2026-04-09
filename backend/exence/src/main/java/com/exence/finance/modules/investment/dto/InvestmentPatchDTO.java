package com.exence.finance.modules.investment.dto;

import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_ASSET_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_NOTE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;

import com.exence.finance.modules.investment.enums.InvestmentType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record InvestmentPatchDTO(
        @Size(max = INVESTMENT_ASSET_MAX_LENGTH, message = "{validation.investment.asset.size}") String asset,
        LocalDate purchaseDate,
        InvestmentType type,
        @DecimalMin(value = INVESTMENT_AMOUNT_MIN, message = "{validation.investment.amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.investment.amount.digits}")
                BigDecimal amount,
        @Size(max = INVESTMENT_NOTE_MAX_LENGTH, message = "{validation.investment.note.size}") String note) {}
