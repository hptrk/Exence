package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;

public record YearlyCategoryResult(String categoryName, String categoryColor, Integer statYear, BigDecimal totalAmount)
        implements CategoryResult {}
