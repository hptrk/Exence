package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;

public record CategoryAmountResult(
        String categoryName, String categoryColor, String categoryIcon, BigDecimal totalAmount)
        implements CategoryResult {}
