package com.exence.finance.modules.statistics.dto.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(title = "Series Item DTO", description = "Represents a single series of data points for chart widgets.")
public record SeriesItem(
        @Schema(description = "Name of the data series", example = "Expense")
        String name,

        @Schema(description = "Type of the chart series", example = "column")
        String type,

        @Schema(description = "Color of the data series in hex format", example = "#E55353")
        String color,

        List<DataPoint> data) {}
