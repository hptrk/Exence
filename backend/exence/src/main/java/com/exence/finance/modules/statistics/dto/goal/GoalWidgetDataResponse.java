package com.exence.finance.modules.statistics.dto.goal;

import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Goal Widget Data Response DTO", description = "Response containing data for a specific goal widget.")
public record GoalWidgetDataResponse(
        @Schema(description = "The payload containing the data for the widget.") WidgetDataPayload payload) {}
