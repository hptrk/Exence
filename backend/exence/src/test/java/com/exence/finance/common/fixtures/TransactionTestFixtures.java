package com.exence.finance.common.fixtures;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.transaction.dto.TransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.TransactionGetDTO;
import com.exence.finance.modules.transaction.dto.TransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionTotalsResponse;
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

    public static TransactionCreateDTO createRequest(Long categoryId) {
        return new TransactionCreateDTO(
                "Groceries",
                null,
                LocalDate.of(2026, 1, 15),
                new BigDecimal("5000.00"),
                TransactionType.EXPENSE,
                categoryId,
                SupportedCurrency.EUR,
                null);
    }

    public static TransactionPatchDTO patchRequest() {
        return new TransactionPatchDTO(
                "Updated Groceries",
                null,
                LocalDate.of(2026, 1, 20),
                new BigDecimal("6000.00"),
                null,
                null,
                null,
                null);
    }

    public static TransactionGetDTO getDTO(Long categoryId) {
        return new TransactionGetDTO(
                1L,
                "Groceries",
                null,
                LocalDate.of(2026, 1, 15),
                new BigDecimal("5000.00"),
                TransactionType.EXPENSE,
                false,
                null,
                categoryId,
                SupportedCurrency.EUR,
                BigDecimal.ONE,
                new BigDecimal("5000.00"));
    }

    public static TransactionTotalsResponse totalsResponse() {
        return new TransactionTotalsResponse(new BigDecimal("10000.00"), new BigDecimal("5000.00"));
    }
}
