package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;

public record MonthlyCategoryResult(
        String categoryName, String categoryColor, Integer statYear, Integer statMonth, BigDecimal totalAmount)
        implements MonthlyResult, CategoryResult {}
