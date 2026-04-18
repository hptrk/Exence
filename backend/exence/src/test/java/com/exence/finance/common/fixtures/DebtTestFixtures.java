package com.exence.finance.common.fixtures;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.debt.entity.Debt;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import java.math.BigDecimal;

public final class DebtTestFixtures {

    private DebtTestFixtures() {}

    public static Debt activeBorrowedDebt(BigDecimal remainingAmount) {
        return Debt.builder()
                .id(1L)
                .title("Test Debt")
                .counterpartyName("Alice")
                .currency(SupportedCurrency.EUR)
                .originalAmount(remainingAmount)
                .remainingAmount(remainingAmount)
                .originalBaseCurrencyAmount(remainingAmount)
                .remainingBaseCurrencyAmount(remainingAmount)
                .status(DebtStatus.ACTIVE)
                .type(DebtType.BORROWED)
                .category(CategoryTestFixtures.expenseCategory())
                .build();
    }

    public static Debt activeBorrowedDebtInCurrency(
            SupportedCurrency currency, BigDecimal originalAmount, BigDecimal remainingAmount, BigDecimal baseAmount) {
        return Debt.builder()
                .id(1L)
                .title("Loan")
                .counterpartyName("John")
                .currency(currency)
                .originalAmount(originalAmount)
                .remainingAmount(remainingAmount)
                .originalBaseCurrencyAmount(baseAmount)
                .remainingBaseCurrencyAmount(baseAmount)
                .status(DebtStatus.ACTIVE)
                .type(DebtType.BORROWED)
                .category(CategoryTestFixtures.expenseCategory())
                .build();
    }
}
