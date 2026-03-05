package com.exence.finance.modules.statistics.dto.payload;

import java.math.BigDecimal;

public record StatCardPayload(
        BigDecimal value,
        String unit,
        String contextLabel,
        BigDecimal changePercentage,
        Trend trend,
        String icon,
        String iconColor)
        implements WidgetDataPayload {}
