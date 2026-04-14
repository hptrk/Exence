package com.exence.finance.modules.investment.dto;

import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_ASSET_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_NOTE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.investment.enums.InvestmentType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(title = "Investment Create DTO", description = "Data required to record a new investment purchase.")
public record InvestmentCreateDTO(
        @Schema(description = "Name of the asset being invested in.", example = "Bitcoin")
                @NotBlank(message = "{validation.investment.asset.not-blank}")
                @Size(max = INVESTMENT_ASSET_MAX_LENGTH, message = "{validation.investment.asset.size}")
                String asset,
        @Schema(description = "Date when the investment was purchased.", example = "2025-03-15")
                @NotNull(message = "{validation.investment.purchase-date.not-null}")
                LocalDate purchaseDate,
        @Schema(description = "Type of the investment asset.", example = "CRYPTO")
                @NotNull(message = "{validation.investment.type.not-null}")
                InvestmentType type,
        @Schema(description = "Amount invested in the specified currency.", example = "500000.00")
                @NotNull(message = "{validation.investment.amount.not-null}")
                @DecimalMin(value = INVESTMENT_AMOUNT_MIN, message = "{validation.investment.amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.investment.amount.digits}")
                BigDecimal amount,
        @Schema(description = "Currency used for the investment.", example = "HUF")
                @NotNull(message = "{validation.investment.currency.not-null}")
                SupportedCurrency currency,
        @Schema(description = "Optional notes about the investment.", example = "Long-term hold")
                @Size(max = INVESTMENT_NOTE_MAX_LENGTH, message = "{validation.investment.note.size}")
                String note) {}
