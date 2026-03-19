package com.exence.finance.modules.statistics.dto.payload;

import java.math.BigDecimal;
import java.util.Map;

public record SlopeItem(String category, Map<String, BigDecimal> yearsData, String color) {}
