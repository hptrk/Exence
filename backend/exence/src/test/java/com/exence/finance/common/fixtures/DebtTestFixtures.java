package com.exence.finance.common.fixtures;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtGetDTO;
import com.exence.finance.modules.debt.dto.DebtPatchDTO;
import com.exence.finance.modules.debt.dto.DebtPaymentDTO;
import com.exence.finance.modules.debt.entity.Debt;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import java.math.BigDecimal;
import java.time.LocalDate;

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

    public static DebtCreateDTO createRequest(Long categoryId) {
        return new DebtCreateDTO(
                "Car Loan",
                "John Doe",
                new BigDecimal("15000.00"),
                SupportedCurrency.EUR,
                LocalDate.of(2026, 12, 31),
                DebtType.BORROWED,
                categoryId);
    }

    public static DebtPatchDTO patchRequest() {
        return new DebtPatchDTO("Updated Loan", null, LocalDate.of(2027, 6, 30), null, null, null);
    }

    public static DebtPaymentDTO paymentRequest() {
        return new DebtPaymentDTO(new BigDecimal("500.00"));
    }

    public static DebtGetDTO getDTO(Long categoryId) {
        return new DebtGetDTO(
                1L,
                "Car Loan",
                "John Doe",
                new BigDecimal("15000.00"),
                new BigDecimal("15000.00"),
                new BigDecimal("15000.00"),
                new BigDecimal("15000.00"),
                SupportedCurrency.EUR,
                LocalDate.of(2026, 12, 31),
                DebtType.BORROWED,
                DebtStatus.ACTIVE,
                categoryId,
                BigDecimal.ZERO);
    }
}
