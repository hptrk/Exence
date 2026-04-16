package com.exence.finance.modules.statistics.dto.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

// x = count, y = average, z = sum
@Schema(title = "Bubble Point DTO", description = "Represents a single point in a bubble chart.")
public record BubblePoint(
        @Schema(
                        description =
                                "The x-axis value for the bubble point, representing the count of items for example in the"
                                        + " category.",
                        example = "5")
                Integer x,
        @Schema(
                        description =
                                "The y-axis value for the bubble point, representing the average value for example in the"
                                        + " category.",
                        example = "158400.00")
                BigDecimal y,
        @Schema(
                        description =
                                "The z-axis value for the bubble point, representing the sum of values for example in the"
                                        + " category. This value determines the size of the bubble.",
                        example = "792000.00")
                BigDecimal z) {}
