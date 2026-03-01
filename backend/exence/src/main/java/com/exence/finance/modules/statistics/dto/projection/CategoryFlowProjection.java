package com.exence.finance.modules.statistics.dto.projection;

import com.exence.finance.modules.statistics.dto.projection.base.CategoryProjection;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;

public interface CategoryFlowProjection extends CategoryProjection {
    TransactionType getType();

    BigDecimal getTotalAmount();
}
