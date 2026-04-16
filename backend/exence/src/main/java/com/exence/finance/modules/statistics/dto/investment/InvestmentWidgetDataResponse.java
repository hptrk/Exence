package com.exence.finance.modules.statistics.dto.investment;

import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
        title = "Investment Widget Data Response DTO",
        description = "Response containing data for a specific investment widget.")
public record InvestmentWidgetDataResponse(
        @Schema(description = "The payload containing the data for the widget.") WidgetDataPayload payload) {}
