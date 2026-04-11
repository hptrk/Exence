package com.exence.finance.modules.statistics.dto.debt;

import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Debt Widget Data Response DTO", description = "Response containing data for a specific debt widget.")
public record DebtWidgetDataResponse(
        @Schema(description = "The type of the debt widget.", example = "DEBT_TOTAL_OWED_TO_ME_STATCARD")
                DebtWidgetType type,
        @Schema(description = "The payload containing the data for the widget.", example = "StatCardPayload")
                WidgetDataPayload payload) {}
