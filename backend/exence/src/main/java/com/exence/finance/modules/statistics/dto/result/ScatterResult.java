package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;
import java.time.Instant;

public record ScatterResult(Instant transactionDate, BigDecimal amount, String categoryName, String categoryColor)
        implements CategoryResult {}
