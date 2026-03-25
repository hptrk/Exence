package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;

public record MonthlyBalanceResult(Integer statYear, Integer statMonth, BigDecimal totalAmount)
        implements MonthlyResult {}
