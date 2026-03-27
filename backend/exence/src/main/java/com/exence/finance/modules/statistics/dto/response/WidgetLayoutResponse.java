package com.exence.finance.modules.statistics.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(
        title = "Widget Layout Response DTO",
        description = "Contains the layout information for all widgets. This layout is used by the frontend to render"
                + " the dashboard according to the user's preferences.")
public record WidgetLayoutResponse(List<StatCardWidgetDTO> statCards, List<ChartWidgetDTO> charts) {}
