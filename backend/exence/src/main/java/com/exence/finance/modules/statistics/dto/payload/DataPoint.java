package com.exence.finance.modules.statistics.dto.payload;

import java.math.BigDecimal;

public record DataPoint(Object x, BigDecimal y, String fillColor) {}
