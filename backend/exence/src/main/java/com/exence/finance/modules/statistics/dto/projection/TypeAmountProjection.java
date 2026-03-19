package com.exence.finance.modules.statistics.dto.projection;

import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;

public interface TypeAmountProjection {
    TransactionType getType();

    BigDecimal getTotalAmount();
}
