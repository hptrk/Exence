package com.exence.finance.modules.statistics.dto.projection;

import com.exence.finance.modules.statistics.dto.projection.base.CategoryProjection;
import com.exence.finance.modules.statistics.dto.projection.base.MonthlyProjection;
import java.math.BigDecimal;

public interface MonthlyCategoryProjection extends MonthlyProjection, CategoryProjection {
    BigDecimal getTotalAmount();
}
