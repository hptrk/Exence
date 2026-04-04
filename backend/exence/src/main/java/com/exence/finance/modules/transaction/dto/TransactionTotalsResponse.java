package com.exence.finance.modules.transaction.dto;

import java.math.BigDecimal;

public record TransactionTotalsResponse(BigDecimal totalIncome, BigDecimal totalExpense) {}
