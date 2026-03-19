package com.exence.finance.modules.statistics.dto.projection;

import java.math.BigDecimal;

public interface HeatmapProjection {
    Integer getDayOfWeek();

    Integer getWeekNumber();

    BigDecimal getTotalAmount();
}
