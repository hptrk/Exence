package com.exence.finance.modules.statistics.dto.admin;

import com.exence.finance.modules.statistics.dto.Timeframe;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(title = "Admin Widget Request DTO", description = "Request parameters for fetching admin widget data.")
public record AdminWidgetRequest(
        @Schema(description = "The start date for the data range.", example = "2026-01-01") LocalDate startDate,
        @Schema(description = "The end date for the data range.", example = "2026-01-31") LocalDate endDate,
        @Schema(description = "The timeframe for the data aggregation.", example = "THREE_MONTHS")
                Timeframe timeframe) {}
