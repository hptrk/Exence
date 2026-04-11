package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(
        title = "Bubble Chart Payload DTO",
        description = "Contains a list of BubbleSeries objects, each representing a series of data points for a bubble"
                + " chart.")
public record BubblePayload(@Schema(example = "CATEGORY_BUBBLE") WidgetType type, List<BubbleSeries> series)
        implements WidgetDataPayload {}
