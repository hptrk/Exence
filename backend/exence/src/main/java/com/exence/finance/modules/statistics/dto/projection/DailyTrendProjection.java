package com.exence.finance.modules.statistics.dto.projection;

import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.time.Instant;

public interface DailyTrendProjection {
    TransactionType getType();

    Instant getStatDate();

    BigDecimal getTotalAmount();
}
