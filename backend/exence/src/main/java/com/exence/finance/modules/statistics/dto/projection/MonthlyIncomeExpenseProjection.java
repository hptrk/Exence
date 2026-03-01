package com.exence.finance.modules.statistics.dto.projection;

import com.exence.finance.modules.statistics.dto.projection.base.MonthlyProjection;
import java.math.BigDecimal;

public interface MonthlyIncomeExpenseProjection extends MonthlyProjection {
    BigDecimal getIncomeAmount();

    BigDecimal getExpenseAmount();

    Long getTransactionCount();
}
