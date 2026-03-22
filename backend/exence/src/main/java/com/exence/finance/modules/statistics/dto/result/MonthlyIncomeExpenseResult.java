package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;

public record MonthlyIncomeExpenseResult(
        Integer statYear, Integer statMonth, BigDecimal incomeAmount, BigDecimal expenseAmount, Long transactionCount)
        implements MonthlyResult {}
