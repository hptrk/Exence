package com.exence.finance.modules.statistics.dto.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(title = "Sankey Link DTO", description = "Represents a single link in a Sankey diagram.")
public record SankeyLink(
        @Schema(description = "The source node of the link", example = "Salary")
        String from,

        @Schema(description = "The target node of the link", example = "Groceries")
        String to,

        @Schema(description = "The value of the flow between source and target", example = "23300.00")
        BigDecimal value,

        @Schema(description = "The color of the link in the Sankey diagram", example = "#4DB6AC")
        String color) {}
