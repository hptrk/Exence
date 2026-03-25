package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;

public record TopTransactionResult(BigDecimal amount, String title, String categoryColor, String categoryIcon) {}
