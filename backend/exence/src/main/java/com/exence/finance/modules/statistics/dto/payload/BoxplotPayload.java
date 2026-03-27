package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(
        title = "Boxplot Payload DTO",
        description = "Contains a list of BoxplotPoint objects, each representing a single boxplot on the chart.")
public record BoxplotPayload(@Schema(example = "BOXPLOT") WidgetType type, List<BoxplotPoint> data)
        implements WidgetDataPayload {}
