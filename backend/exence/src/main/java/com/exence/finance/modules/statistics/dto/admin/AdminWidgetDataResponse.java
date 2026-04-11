package com.exence.finance.modules.statistics.dto.admin;

import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Admin Widget Data Response DTO", description = "Contains data for a specific admin widget.")
public record AdminWidgetDataResponse(
        @Schema(description = "The type of the admin widget.", example = "MONTHLY_ACTIVE_USERS") AdminWidgetType type,
        @Schema(description = "The payload containing the data for the widget.", example = "BoxplotPayload")
                WidgetDataPayload payload) {}
