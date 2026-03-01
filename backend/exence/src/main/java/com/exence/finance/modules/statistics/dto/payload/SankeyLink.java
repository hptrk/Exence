package com.exence.finance.modules.statistics.dto.payload;

import java.math.BigDecimal;

public record SankeyLink(String from, String to, BigDecimal value, String color) {}
