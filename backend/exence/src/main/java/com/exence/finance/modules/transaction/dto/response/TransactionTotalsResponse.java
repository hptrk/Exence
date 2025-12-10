package com.exence.finance.modules.transaction.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionTotalsResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
}

