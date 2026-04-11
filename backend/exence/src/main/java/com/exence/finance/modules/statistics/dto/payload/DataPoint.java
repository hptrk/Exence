package com.exence.finance.modules.statistics.dto.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(title = "Data Point DTO", description = "Represents a single data point in a chart.")
public record DataPoint(
        @Schema(
                        description = "The x-value of the data point, which can be for example a category label",
                        example = "Groceries")
                Object x,
        @Schema(
                        description =
                                "The y-value of the data point, which is typically a numeric value representing the"
                                        + " measurement",
                        example = "31450.00")
                BigDecimal y,
        @Schema(description = "The fill color for the data point in hex format", example = "#C9C9F2")
                String fillColor) {}
