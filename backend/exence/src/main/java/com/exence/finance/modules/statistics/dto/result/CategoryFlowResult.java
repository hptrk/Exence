package com.exence.finance.modules.statistics.dto.result;

import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;

public record CategoryFlowResult(
        TransactionType type, String categoryName, String categoryColor, BigDecimal totalAmount)
        implements CategoryResult {}
