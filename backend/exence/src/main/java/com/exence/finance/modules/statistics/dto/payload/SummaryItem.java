package com.exence.finance.modules.statistics.dto.payload;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Summary Item DTO", description = "Represents a single item in a summary widget.")
public record SummaryItem(
        @Schema(description = "The label for the summary item", example = "Total Income") String label,
        @Schema(description = "The value associated with the summary item", example = "50000.00") Object value,
        @Schema(description = "The icon representing the summary item", example = "money_bag") String icon) {}
