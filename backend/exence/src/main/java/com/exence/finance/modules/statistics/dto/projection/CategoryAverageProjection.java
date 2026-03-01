package com.exence.finance.modules.statistics.dto.projection;

import com.exence.finance.modules.statistics.dto.projection.base.CategoryProjection;
import java.math.BigDecimal;

public interface CategoryAverageProjection extends CategoryProjection {
    BigDecimal getAvgAmount();
}
