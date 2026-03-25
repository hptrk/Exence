package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;

public record CategoryAverageResult(String categoryName, String categoryColor, BigDecimal avgAmount)
        implements CategoryResult {}
