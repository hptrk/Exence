package com.exence.finance.modules.statistics.dto.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(title = "Bubble Series DTO", description = "Represents a single series of data points for a bubble chart.")
public record BubbleSeries(
        @Schema(description = "The name of the series, for example a category name.", example = "Groceries")
                String name,
        List<BubblePoint> data,
        @Schema(
                        description =
                                "The color of the series. This can be used to differentiate between for example different"
                                        + " categories.",
                        example = "#4DB6AC")
                String color) {}
