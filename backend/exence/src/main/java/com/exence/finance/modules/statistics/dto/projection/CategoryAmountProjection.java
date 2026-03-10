package com.exence.finance.modules.statistics.dto.projection;

import com.exence.finance.modules.statistics.dto.projection.base.CategoryProjection;
import java.math.BigDecimal;

public interface CategoryAmountProjection extends CategoryProjection {
    BigDecimal getTotalAmount();

    String getCategoryIcon();
}
