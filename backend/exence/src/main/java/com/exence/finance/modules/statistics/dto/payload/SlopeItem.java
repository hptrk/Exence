package com.exence.finance.modules.statistics.dto.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.Map;

@Schema(title = "Slope Item DTO", description = "Represents a single data series in a slope chart.")
public record SlopeItem(
        @Schema(
                        description = "The name of the category or series being represented in the slope chart.",
                        example = "Groceries")
                String category,
        @Schema(
                        description = "A mapping of years to their corresponding values for this category.",
                        example = "{'2023': 441200.00, '2024': 429450.00, '2025': 546120.00}")
                Map<String, BigDecimal> yearsData,
        @Schema(
                        description =
                                "The color to be used for this series in the slope chart, represented as a hex code.",
                        example = "#C9C9F2")
                String color) {}
