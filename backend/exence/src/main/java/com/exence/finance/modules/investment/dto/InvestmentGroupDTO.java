package com.exence.finance.modules.investment.dto;

import com.exence.finance.modules.investment.enums.InvestmentType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.List;

@Schema(
        title = "Investment Group DTO",
        description = "Represents a group of investment purchases aggregated by asset name and type.")
public record InvestmentGroupDTO(
        @Schema(description = "Name of the asset that the group represents.", example = "Bitcoin") String name,
        @Schema(description = "Number of days elapsed since the most recent purchase in this group.", example = "30")
                long daysSinceLastAction,
        @Schema(
                        description = "Total amount invested in this asset, in the workspace base currency.",
                        example = "2500.00")
                BigDecimal totalInvested,
        @Schema(description = "Type of the investment asset.", example = "CRYPTO") InvestmentType type,
        @Schema(description = "Number of individual purchase entries in this group.", example = "3") int purchasesCount,
        @Schema(description = "List of individual investment purchase entries belonging to this group.")
                List<InvestmentGetDTO> purchases) {}
