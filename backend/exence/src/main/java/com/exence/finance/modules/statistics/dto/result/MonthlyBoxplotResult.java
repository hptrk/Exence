package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;

public record MonthlyBoxplotResult(
        int year, int month, BigDecimal min, BigDecimal q1, BigDecimal median, BigDecimal q3, BigDecimal max) {}
