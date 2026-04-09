package com.exence.finance.modules.category.dto.projection;

import java.math.BigDecimal;

public interface CategoryBalanceSums {
    Long getId();

    BigDecimal getTotalIncome();

    BigDecimal getTotalExpense();
}

