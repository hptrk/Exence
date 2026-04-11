package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(title = "Summary Payload DTO", description = "Payload for summary widgets.")
public record SummaryPayload(@Schema(example = "DATABASE_GROWTH_SUMMARY") WidgetType type, List<SummaryItem> items)
        implements WidgetDataPayload {}
