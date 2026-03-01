package com.exence.finance.modules.statistics.dto.payload;

import java.math.BigDecimal;

public record GaugePayload(BigDecimal data) implements WidgetDataPayload {}
