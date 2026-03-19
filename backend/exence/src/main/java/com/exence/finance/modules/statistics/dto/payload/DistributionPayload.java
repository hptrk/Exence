package com.exence.finance.modules.statistics.dto.payload;

import java.util.List;

public record DistributionPayload(List<DistributionItem> data) implements WidgetDataPayload {}
