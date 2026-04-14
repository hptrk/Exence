package com.exence.finance.modules.investment.dto;

import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_ASSET_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_NOTE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;

import com.exence.finance.modules.investment.enums.InvestmentType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(
        title = "Investment Patch DTO",
        description = "For updating an existing investment entry. All fields are optional.")
public record InvestmentPatchDTO(
        @Schema(description = "Updated name of the asset.", example = "Ethereum")
        @Size(max = INVESTMENT_ASSET_MAX_LENGTH, message = "{validation.investment.asset.size}")
        String asset,

        @Schema(description = "Updated purchase date of the investment.", example = "2026-04-01")
        LocalDate purchaseDate,

        @Schema(description = "Updated type of the investment asset.", example = "CRYPTO")
        InvestmentType type,

        @Schema(description = "Updated invested amount.", example = "750000.00")
        @DecimalMin(value = INVESTMENT_AMOUNT_MIN, message = "{validation.investment.amount.min}")
        @Digits(
                integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                message = "{validation.investment.amount.digits}")
        BigDecimal amount,

        @Schema(description = "Updated notes about the investment.", example = "Switched to medium-term hold")
        @Size(max = INVESTMENT_NOTE_MAX_LENGTH, message = "{validation.investment.note.size}")
        String note) {}
