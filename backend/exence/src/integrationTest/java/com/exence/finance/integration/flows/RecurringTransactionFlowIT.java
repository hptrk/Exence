package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.transaction.dto.EndCondition;
import com.exence.finance.modules.transaction.dto.RecurrenceFrequency;
import com.exence.finance.modules.transaction.dto.RecurringTransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 6 — Recurring Transactions
 *
 * <p>FLOW-REC-01: Full recurring transaction lifecycle
 */
class RecurringTransactionFlowIT extends BaseFlowIT {

    @Test
    void flowRec01_fullRecurringTransactionLifecycle() {
        AuthContext user = authActor().registerVerifiedUser();
        var cat = categoryActor().createExpenseCategory(user);

        // 3. Create WEEKLY recurring with UNTIL_DATE
        var rec1 = transactionActor()
                .createRecurring(
                        user,
                        ITFixtures.recurringTransaction(cat.id())
                                .frequency(RecurrenceFrequency.WEEKLY)
                                .interval(1)
                                .dayOfMonth(null)
                                .dayOfWeek(LocalDate.now().getDayOfWeek())
                                .endCondition(EndCondition.UNTIL_DATE)
                                .endDate(LocalDate.now().plusMonths(3))
                                .maxOccurrences(null)
                                .startDate(LocalDate.now())
                                .build());
        assertThat(rec1.id()).isPositive();
        assertThat(rec1.nextExecutionDate()).isNotNull();

        // 4. Create WEEKLY with AFTER_OCCURRENCES
        var rec2 = transactionActor()
                .createRecurring(
                        user,
                        ITFixtures.recurringTransaction(cat.id())
                                .title("Weekly subscription")
                                .frequency(RecurrenceFrequency.WEEKLY)
                                .interval(1)
                                .dayOfMonth(null)
                                .dayOfWeek(LocalDate.now().getDayOfWeek())
                                .endCondition(EndCondition.AFTER_OCCURRENCES)
                                .endDate(null)
                                .maxOccurrences(12)
                                .startDate(LocalDate.now())
                                .build());
        assertThat(rec2.id()).isPositive();

        // 5. MONTHLY without endDate but UNTIL_DATE → 400 VALIDATION_ERROR
        transactionActor()
                .createRecurringRaw(
                        user,
                        ITFixtures.recurringTransaction(cat.id())
                                .frequency(RecurrenceFrequency.MONTHLY)
                                .endCondition(EndCondition.UNTIL_DATE)
                                .endDate(null)
                                .maxOccurrences(null)
                                .build())
                .statusCode(400)
                .body("code", equalTo("validation-error"));

        // 6. GET /transactions/recurring → 2 active items
        assertThat(transactionActor().listRecurring(user)).hasSize(2);

        // 7. Filter by type=EXPENSE → both are expense
        assertThat(transactionActor().listRecurringByType(user, TransactionType.EXPENSE))
                .hasSize(2);

        // 8. GET single recurring → all fields present
        var loaded = transactionActor().getRecurring(user, rec1.id());
        assertThat(loaded.frequency()).isEqualTo(RecurrenceFrequency.WEEKLY);

        // 9. PATCH title + amount → 200, new values
        var patched = transactionActor()
                .patchRecurring(
                        user,
                        rec1.id(),
                        new RecurringTransactionPatchDTO(
                                "Updated Daily",
                                null,
                                new BigDecimal("3000"),
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null));
        assertThat(patched.title()).isEqualTo("Updated Daily");
        assertThat(patched.amount()).isEqualByComparingTo(new BigDecimal("3000"));

        // 10. DELETE rec1 → 204
        transactionActor().deleteRecurring(user, rec1.id());

        // 11. GET /transactions/recurring → 1 item remains
        assertThat(transactionActor().listRecurring(user)).hasSize(1);

        // 12. GET deleted recurring → 404
        transactionActor()
                .getRecurringRaw(user, rec1.id())
                .statusCode(404)
                .body("code", equalTo("recurring-transaction-not-found"));
    }
}
