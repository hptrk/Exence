package com.exence.finance.modules.statistics.dto.payload;

import java.util.List;

public record SummaryPayload(List<SummaryItem> items) implements WidgetDataPayload {}
