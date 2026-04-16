package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(
        title = "Gauge Payload DTO",
        description = "Payload for gauge widgets, which represent a single value in a gauge format.")
public record GaugePayload(
        @Schema(example = "SAVINGS_RATE_GAUGE") StatisticsWidgetType type,
        @Schema(description = "The value to be displayed on the gauge", example = "0.25") BigDecimal data)
        implements WidgetDataPayload {}
