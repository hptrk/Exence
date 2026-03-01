package com.exence.finance.modules.statistics.dto.payload;

import java.util.List;

public record SankeyPayload(List<SankeyLink> data) implements WidgetDataPayload {}
