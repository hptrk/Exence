package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(
        title = "Sankey Payload DTO",
        description =
                "Payload for Sankey chart widgets, containing a list of links representing flows between categories.")
public record SankeyPayload(@Schema(example = "CATEGORY_SANKEY") WidgetType type, List<SankeyLink> data)
        implements WidgetDataPayload {}
