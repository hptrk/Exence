package com.exence.finance.modules.statistics.dto.projection;

import com.exence.finance.modules.statistics.dto.projection.base.CategoryProjection;
import java.math.BigDecimal;
import java.time.Instant;

public interface ScatterProjection extends CategoryProjection {
    Instant getTransactionDate();

    BigDecimal getAmount();
}
