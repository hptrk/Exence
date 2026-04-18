package com.exence.finance.common.fixtures;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.transaction.dto.EndCondition;
import com.exence.finance.modules.transaction.dto.RecurrenceFrequency;
import com.exence.finance.modules.transaction.dto.RecurringTransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionGetDTO;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.RecurringTransaction;
import java.math.BigDecimal;
import java.time.LocalDate;

public final class RecurringTransactionTestFixtures {

    private RecurringTransactionTestFixtures() {}

    public static RecurringTransaction weeklyRecurring(int interval) {
        return RecurringTransaction.builder()
                .frequency(RecurrenceFrequency.WEEKLY)
                .interval(interval)
                .build();
    }

    public static RecurringTransaction monthlyRecurring(int interval, int dayOfMonth) {
        return RecurringTransaction.builder()
                .frequency(RecurrenceFrequency.MONTHLY)
                .interval(interval)
                .dayOfMonth(dayOfMonth)
                .build();
    }

    public static RecurringTransaction yearlyRecurring(int interval) {
        return RecurringTransaction.builder()
                .frequency(RecurrenceFrequency.YEARLY)
                .interval(interval)
                .build();
    }

    public static RecurringTransaction weeklyWithoutDayOfWeek(Long id, int interval) {
        return RecurringTransaction.builder()
                .id(id)
                .frequency(RecurrenceFrequency.WEEKLY)
                .dayOfWeek(null)
                .interval(interval)
                .category(CategoryTestFixtures.expenseCategory())
                .build();
    }

    public static RecurringTransaction monthlyUntilDateWithoutEndDate(Long id, int interval, int dayOfMonth) {
        return RecurringTransaction.builder()
                .id(id)
                .frequency(RecurrenceFrequency.MONTHLY)
                .dayOfMonth(dayOfMonth)
                .interval(interval)
                .endCondition(EndCondition.UNTIL_DATE)
                .endDate(null)
                .category(CategoryTestFixtures.expenseCategory())
                .build();
    }

    public static RecurringTransaction recurringTransactionWithId(Long id) {
        return RecurringTransaction.builder()
                .id(id)
                .category(CategoryTestFixtures.expenseCategory())
                .build();
    }

    public static RecurringTransactionCreateDTO createRequest(Long categoryId) {
        return new RecurringTransactionCreateDTO(
                "Netflix",
                null,
                new BigDecimal("4500.00"),
                TransactionType.EXPENSE,
                categoryId,
                SupportedCurrency.EUR,
                RecurrenceFrequency.MONTHLY,
                1,
                null,
                15,
                EndCondition.UNTIL_DATE,
                LocalDate.of(2027, 12, 31),
                null,
                LocalDate.of(2026, 1, 15));
    }

    public static RecurringTransactionGetDTO getDTO(Long categoryId) {
        return new RecurringTransactionGetDTO(
                1L,
                "Netflix",
                null,
                new BigDecimal("4500.00"),
                TransactionType.EXPENSE,
                categoryId,
                SupportedCurrency.EUR,
                RecurrenceFrequency.MONTHLY,
                1,
                null,
                15,
                EndCondition.UNTIL_DATE,
                LocalDate.of(2027, 12, 31),
                null,
                0,
                LocalDate.of(2026, 2, 15),
                true);
    }
}
