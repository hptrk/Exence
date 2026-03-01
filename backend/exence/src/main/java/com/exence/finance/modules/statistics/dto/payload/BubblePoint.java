package com.exence.finance.modules.statistics.dto.payload;

import java.math.BigDecimal;

// x = count, y = average, z = sum
public record BubblePoint(Integer x, BigDecimal y, BigDecimal z) {}
