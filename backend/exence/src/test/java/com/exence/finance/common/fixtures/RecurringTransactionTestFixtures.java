package com.exence.finance.common.fixtures;

import com.exence.finance.modules.transaction.dto.EndCondition;
import com.exence.finance.modules.transaction.dto.RecurrenceFrequency;
import com.exence.finance.modules.transaction.entity.RecurringTransaction;

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
}
