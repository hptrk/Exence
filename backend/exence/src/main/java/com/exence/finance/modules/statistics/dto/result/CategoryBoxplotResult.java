package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;

public record CategoryBoxplotResult(
        String name, String color, BigDecimal min, BigDecimal q1, BigDecimal median, BigDecimal q3, BigDecimal max) {}
