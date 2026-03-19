package com.exence.finance.modules.statistics.dto.projection;

import com.exence.finance.modules.statistics.dto.projection.base.MonthlyProjection;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;

public interface MonthlyTrendProjection extends MonthlyProjection {
    TransactionType getType();

    BigDecimal getTotalAmount();

    Long getTransactionCount();
}
