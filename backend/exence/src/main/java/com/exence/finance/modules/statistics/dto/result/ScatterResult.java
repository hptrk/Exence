package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ScatterResult(LocalDate transactionDate, BigDecimal amount, String categoryName, String categoryColor)
        implements CategoryResult {}
