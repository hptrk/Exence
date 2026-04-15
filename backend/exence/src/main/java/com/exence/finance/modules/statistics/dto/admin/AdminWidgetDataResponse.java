package com.exence.finance.modules.statistics.dto.admin;

import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Admin Widget Data Response DTO", description = "Contains data for a specific admin widget.")
public record AdminWidgetDataResponse(
        @Schema(description = "The payload containing the data for the widget.") WidgetDataPayload payload) {}
