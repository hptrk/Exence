package com.exence.finance.modules.investment.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.investment.enums.InvestmentType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(title = "Investment Get DTO", description = "Used for retrieving details of an investment entry.")
public record InvestmentGetDTO(
        @Schema(description = "Unique identifier of the investment entry.", example = "1") Long id,
        @Schema(description = "Name of the asset that was purchased.", example = "Bitcoin") String asset,
        @Schema(description = "Date when the investment was purchased.", example = "2025-03-15") LocalDate purchaseDate,
        @Schema(description = "Type of the investment asset.", example = "CRYPTO") InvestmentType type,
        @Schema(description = "Amount invested in the specified currency.", example = "500000.00") BigDecimal amount,
        @Schema(description = "Currency used for the investment.", example = "HUF") SupportedCurrency currency,
        @Schema(description = "Invested amount converted to the workspace base currency.", example = "1250.00")
                BigDecimal baseCurrencyAmount,
        @Schema(description = "Optional notes about the investment.", example = "Long-term hold") String note) {}
