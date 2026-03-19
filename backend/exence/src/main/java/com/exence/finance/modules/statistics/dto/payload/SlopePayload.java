package com.exence.finance.modules.statistics.dto.payload;

import java.util.List;

public record SlopePayload(List<SlopeItem> data) implements WidgetDataPayload {}
