package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 8 — Debts
 *
 * <p>FLOW-DEBT-01: Full debt payment lifecycle (partial + full)
 * <p>FLOW-DEBT-02: Mixed debt portfolio and widget data
 */
class DebtFlowIT extends BaseFlowIT {

    @Test
    void flowDebt01_fullPaymentLifecycle() {
        AuthContext user = authActor().registerVerifiedUser();
        var cat = categoryActor().createExpenseCategory(user);

        // 3. Create LENT debt, originalAmount=300 → ACTIVE, remainingAmount=300
        var debt = debtActor()
                .createDebt(
                        user,
                        ITFixtures.debt(cat.id())
                                .type(DebtType.LENT)
                                .amount(new BigDecimal("300"))
                                .counterpartyName("Test Friend")
                                .build());
        assertThat(debt.status()).isEqualTo(DebtStatus.ACTIVE);
        assertThat(debt.remainingAmount()).isEqualByComparingTo(new BigDecimal("300"));

        // 4. List all debts → 1
        assertThat(debtActor().listDebts(user)).hasSize(1);

        // 5. Filter by type=LENT → 1
        assertThat(debtActor().listDebtsByType(user, DebtType.LENT)).hasSize(1);

        // 6. Filter by status=SETTLED → empty
        assertThat(debtActor().listDebtsByStatus(user, DebtStatus.SETTLED)).isEmpty();

        // 7. Pay 100 → remainingAmount=200, ACTIVE
        var after100 = debtActor()
                .payDebt(
                        user,
                        debt.id(),
                        ITFixtures.debtPayment().amount(new BigDecimal("100")).build());
        assertThat(after100.remainingAmount()).isEqualByComparingTo(new BigDecimal("200"));
        assertThat(after100.status()).isEqualTo(DebtStatus.ACTIVE);

        // 8. Pay 250 (would exceed remaining 200) → 400 DEBT_PAYMENT_EXCEEDS_REMAINING
        debtActor()
                .payDebtRaw(
                        user,
                        debt.id(),
                        ITFixtures.debtPayment().amount(new BigDecimal("250")).build())
                .statusCode(400)
                .body("code", equalTo("debt-payment-exceeds-remaining"));

        // 9. Pay remaining 200 → SETTLED, remainingAmount=0
        var settled = debtActor()
                .payDebt(
                        user,
                        debt.id(),
                        ITFixtures.debtPayment().amount(new BigDecimal("200")).build());
        assertThat(settled.remainingAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(settled.status()).isEqualTo(DebtStatus.SETTLED);

        // 10. Filter by SETTLED → 1
        assertThat(debtActor().listDebtsByStatus(user, DebtStatus.SETTLED)).hasSize(1);

        // 11. Filter by ACTIVE → empty
        assertThat(debtActor().listDebtsByStatus(user, DebtStatus.ACTIVE)).isEmpty();
    }

    @Test
    void flowDebt02_mixedPortfolioAndWidgetData() {
        AuthContext user = authActor().registerVerifiedUser();
        var cat = categoryActor().createExpenseCategory(user);

        // 3-4. Create LENT and BORROWED debts
        var lent = debtActor()
                .createDebt(
                        user,
                        ITFixtures.debt(cat.id())
                                .type(DebtType.LENT)
                                .amount(new BigDecimal("500"))
                                .build());
        var borrowed = debtActor()
                .createDebt(
                        user,
                        ITFixtures.debt(cat.id())
                                .type(DebtType.BORROWED)
                                .amount(new BigDecimal("200"))
                                .build());

        // 5. List all → 2 debts
        assertThat(debtActor().listDebts(user)).hasSize(2);

        // 6. Filter BORROWED → 1
        assertThat(debtActor().listDebtsByType(user, DebtType.BORROWED)).hasSize(1);

        // 7. PATCH lent debt (title + deadline) → 200
        var patched = debtActor()
                .patchDebt(
                        user,
                        lent.id(),
                        ITFixtures.debtPatch()
                                .title("Updated Lent")
                                .deadline(LocalDate.now().plusMonths(6))
                                .build());
        assertThat(patched.title()).isEqualTo("Updated Lent");

        // 8. GET debt → updated data
        var fetched = debtActor().getDebt(user, lent.id());
        assertThat(fetched.title()).isEqualTo("Updated Lent");

        // 9. Widget summary data
        debtActor().getWidgetDataRaw(user, "DEBT_TOTAL_OWED_TO_ME_STATCARD").statusCode(200);

        // 10. DELETE borrowed debt → 204
        debtActor().deleteDebt(user, borrowed.id());

        // 11. List → 1 debt remains
        assertThat(debtActor().listDebts(user)).hasSize(1);

        // 12. Unverified user → 403 EMAIL_VERIFICATION_REQUIRED
        AuthContext unverified = authActor().registerUser();
        debtActor()
                .listDebtsRaw(unverified.withWorkspace(user.workspaceId()))
                .statusCode(403)
                .body("code", equalTo("email-verification-required"));
    }
}
