package com.exence.finance.modules.statistics.dto.response;

import java.util.List;

public record WidgetLayoutResponse(List<StatCardWidgetDTO> statCards, List<ChartWidgetDTO> charts) {}
