package com.exence.finance.modules.category.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Category Filter DTO", description = "Used for filtering categories by type.")
public record CategoryFilter(
        @Schema(description = "Type of the category to filter by.", example = "EXPENSE") CategoryType type) {}
