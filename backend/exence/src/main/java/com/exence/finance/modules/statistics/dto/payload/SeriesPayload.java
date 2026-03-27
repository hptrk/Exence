package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(
        title = "Series Payload DTO",
        description = "Payload for widgets that display a series of data points, such as line charts or bar charts.")
public record SeriesPayload(
        @Schema(example = "EXPENSE_SAVINGS_COMBO") WidgetType type, List<SeriesItem> series)
        implements WidgetDataPayload {}
