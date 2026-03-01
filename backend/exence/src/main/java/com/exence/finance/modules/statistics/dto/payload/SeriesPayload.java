package com.exence.finance.modules.statistics.dto.payload;

import java.util.List;

public record SeriesPayload(List<SeriesItem> series) implements WidgetDataPayload {}
