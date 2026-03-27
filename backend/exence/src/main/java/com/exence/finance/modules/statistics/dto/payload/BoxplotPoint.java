package com.exence.finance.modules.statistics.dto.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.List;

@Schema(title = "Boxplot Point DTO", description = "Represents a single point in a boxplot chart.")
public record BoxplotPoint(
        @Schema(
                description = "The x-axis value for the boxplot point, for example a category name.",
                example = "Groceries")
        Object x,

        @Schema(
                description = "A list of numerical values representing the data points for the boxplot. The list should"
                        + " contain at least 5 values to calculate the minimum, first quartile, median, third"
                        + " quartile, and maximum.",
                example = "[10450.00, 1200.00, 14678.00, 5670.0, 20857.00]")
        List<BigDecimal> y,

        @Schema(
                description = "The color of the boxplot point. This can be used to differentiate between for example"
                        + " different categories.",
                example = "#4DB6AC")
        String color) {}
