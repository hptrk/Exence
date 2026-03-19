package com.exence.finance.modules.statistics.dto.payload;

import java.util.List;

public record BoxplotPayload(List<BoxplotPoint> data) implements WidgetDataPayload {}
