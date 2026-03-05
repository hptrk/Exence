package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.payload.Trend;
import java.math.BigDecimal;

public record TrendResult(BigDecimal changePercentage, Trend trend) {
    public static final TrendResult NEUTRAL = new TrendResult(null, Trend.NEUTRAL);
}
