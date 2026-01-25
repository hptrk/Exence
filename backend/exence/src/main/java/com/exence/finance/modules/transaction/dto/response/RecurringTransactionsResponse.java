package com.exence.finance.modules.transaction.dto.response;

import com.exence.finance.common.dto.PageResponse;
import com.exence.finance.modules.transaction.dto.TransactionDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecurringTransactionsResponse {
    private PageResponse<TransactionDTO> incomes;
    private PageResponse<TransactionDTO> expenses;
    private PageResponse<TransactionDTO> mergedTransactions;
}
