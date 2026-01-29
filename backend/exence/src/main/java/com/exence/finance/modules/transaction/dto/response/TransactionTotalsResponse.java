package com.exence.finance.modules.transaction.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionTotalsResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
}
