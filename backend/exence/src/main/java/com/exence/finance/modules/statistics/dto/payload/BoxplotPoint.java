package com.exence.finance.modules.statistics.dto.payload;

import java.math.BigDecimal;
import java.util.List;

public record BoxplotPoint(Object x, List<BigDecimal> y, String color) {}
