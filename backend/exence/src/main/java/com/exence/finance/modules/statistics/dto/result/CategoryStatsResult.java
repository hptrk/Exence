package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;

public record CategoryStatsResult(
        String categoryName, String categoryColor, BigDecimal totalAmount, Long transactionCount, BigDecimal avgAmount)
        implements CategoryResult {}
