package com.exence.finance.common.fixtures;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.Transaction;
import java.math.BigDecimal;
import java.time.LocalDate;

public final class TransactionTestFixtures {

    private TransactionTestFixtures() {}

    public static Transaction defaultTransaction() {
        return Transaction.builder()
                .id(1L)
                .title("Groceries")
                .date(LocalDate.of(2025, 1, 15))
                .amount(new BigDecimal("50.00"))
                .type(TransactionType.EXPENSE)
                .currency(SupportedCurrency.EUR)
                .exchangeRate(BigDecimal.ONE)
                .baseCurrencyAmount(new BigDecimal("50.00"))
                .createdByRecurringJob(false)
                .category(CategoryTestFixtures.expenseCategory())
                .build();
    }

    public static Transaction foreignCurrencyTransaction() {
        return Transaction.builder()
                .id(2L)
                .title("USD Purchase")
                .date(LocalDate.of(2025, 1, 15))
                .amount(new BigDecimal("100.00"))
                .type(TransactionType.EXPENSE)
                .currency(SupportedCurrency.USD)
                .exchangeRate(new BigDecimal("0.9200"))
                .baseCurrencyAmount(new BigDecimal("92.00"))
                .createdByRecurringJob(false)
                .category(CategoryTestFixtures.expenseCategory())
                .build();
    }
}
