package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(
        title = "Slope Payload DTO",
        description = "Payload for slope chart widgets, containing a list of data points to be plotted.")
public record SlopePayload(@Schema(example = "YEARLY_SLOPE") WidgetType type, List<SlopeItem> data)
        implements WidgetDataPayload {}
