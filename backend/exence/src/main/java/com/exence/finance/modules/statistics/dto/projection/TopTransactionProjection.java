package com.exence.finance.modules.statistics.dto.projection;

import java.math.BigDecimal;

public interface TopTransactionProjection {
    BigDecimal getAmount();

    String getTitle();

    String getCategoryColor();
}
