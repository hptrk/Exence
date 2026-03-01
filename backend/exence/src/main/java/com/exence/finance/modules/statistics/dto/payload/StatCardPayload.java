package com.exence.finance.modules.statistics.dto.payload;

import java.math.BigDecimal;

public record StatCardPayload(
        BigDecimal value,
        String unit,
        BigDecimal changePercentage,
        Trend trend,
        String contextLabel,
        String icon,
        String iconColor)
        implements WidgetDataPayload {}
