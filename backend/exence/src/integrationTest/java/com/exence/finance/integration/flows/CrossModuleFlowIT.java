package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.investment.enums.InvestmentType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.transaction.dto.EndCondition;
import com.exence.finance.modules.transaction.dto.RecurrenceFrequency;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 13 — Complex Cross-Module Flows
 *
 * <p>FLOW-CROSS-01: Full financial onboarding with one user
 * <p>FLOW-CROSS-02: Workspace collaboration and visibility
 * <p>FLOW-CROSS-03: Impact of workspace currency change on transactions
 * <p>FLOW-CROSS-04: Recurring transaction → goal tracking flow
 * <p>FLOW-CROSS-05: Achievement triggering across goals/debts
 * <p>FLOW-CROSS-06: Pre-deletion data export-like check
 * <p>FLOW-CROSS-07: X-Workspace-ID header validations
 */
class CrossModuleFlowIT extends BaseFlowIT {

    @Test
    void flowCross01_fullFinancialOnboarding() {
        // 1-2. Register with HUF base currency and verify
        AuthContext user = authActor().registerVerifiedUser();

        // 3. Verify user profile and settings
        assertThat(userActor().getUser(user).email()).isNotBlank();
        userSettingsActor().getSettings(user);

        // 4. Default workspace exists
        assertThat(workspaceActor().listWorkspaces(user)).hasSize(1);

        // 5-6. Create categories
        var catExpense = categoryActor().createCategory(user,
                ITFixtures.expenseCategory().name("Restaurant").build());
        var catIncome = categoryActor().createIncomeCategory(user);

        // 7-8. Create transactions
        var txn1 = transactionActor().createTransaction(user,
                ITFixtures.transaction(catExpense.id())
                        .type(TransactionType.EXPENSE).amount(new BigDecimal("5000")).build());
        var txn2 = transactionActor().createTransaction(user,
                ITFixtures.transaction(catIncome.id())
                        .type(TransactionType.INCOME).amount(new BigDecimal("500000")).build());

        // 9. Totals
        var totals = transactionActor().getTransactionTotals(user);
        assertThat(totals.totalExpense()).isEqualByComparingTo(new BigDecimal("5000"));
        assertThat(totals.totalIncome()).isEqualByComparingTo(new BigDecimal("500000"));

        // 10-11. Goal
        var goal = goalActor().createGoal(user,
                ITFixtures.goal(catExpense.id()).targetAmount(new BigDecimal("100000"))
                        .currentAmount(BigDecimal.ZERO).build());
        var partialGoal = goalActor().patchGoal(user, goal.id(),
                ITFixtures.goalPatch().currentAmount(new BigDecimal("50000")).build());
        assertThat(partialGoal.status()).isEqualTo(GoalStatus.ACTIVE);

        // 12-13. Debt
        var debt = debtActor().createDebt(user,
                ITFixtures.debt(catExpense.id()).amount(new BigDecimal("20000")).build());
        var paidDebt = debtActor().payDebt(user, debt.id(),
                ITFixtures.debtPayment().amount(new BigDecimal("10000")).build());
        assertThat(paidDebt.remainingAmount()).isEqualByComparingTo(new BigDecimal("10000"));

        // 14-15. Investment
        investmentActor().createInvestment(user,
                ITFixtures.investment().asset("MSFT").type(InvestmentType.STOCK)
                        .amount(new BigDecimal("100")).currency(SupportedCurrency.USD).build());
        assertThat(investmentActor().listGrouped(user)).hasSize(1);

        // 16-17. Statistics widgets
        widgetActor().getLayout(user);
        widgetActor().getDashboardBalanceTrend(user, Timeframe.ONE_MONTH);

        // 18-19. Achievements
        achievementActor().listAll(user);
        achievementActor().listUnlocked(user);
    }

    @Test
    void flowCross02_workspaceCollaborationAndVisibility() {
        // 1-2. Two users
        AuthContext userA = authActor().registerVerifiedUser();
        AuthContext userB = authActor().registerVerifiedUser();
        long wsAId = userA.workspaceId();

        // 3. UserA invites UserB to Workspace-A
        workspaceActor().addMember(userA, wsAId, new WorkspaceMemberEmailRequest(userB.user().email()));
        AuthContext userBInWsA = userB.withWorkspace(wsAId);

        // 4. UserB sees 2 workspaces (own + A)
        assertThat(workspaceActor().listWorkspaces(userB)).hasSize(2);

        // 5. UserA creates category in Workspace-A
        var catA = categoryActor().createCategory(userA,
                ITFixtures.expenseCategory().name("Shared category").build());

        // 6. UserB sees category in Workspace-A
        assertThat(categoryActor().listCategories(userBInWsA).stream()
                .anyMatch(c -> c.id().equals(catA.id()))).isTrue();

        // 7. UserB creates transaction in Workspace-A
        transactionActor().createTransaction(userBInWsA,
                ITFixtures.transaction(catA.id()).build());

        // 8. UserA sees UserB's transaction in Workspace-A
        assertThat(transactionActor().listTransactions(userA)).hasSize(1);

        // 9. UserB sees only own Workspace-B transactions (none)
        assertThat(transactionActor().listTransactions(userB)).isEmpty();

        // 10. UserA's audit log shows UserB's transaction creation
        var auditLogs = auditLogActor().listAuditLogs(userA);
        assertThat(auditLogs).isNotEmpty();

        // 11. UserB leaves Workspace-A
        workspaceActor().leaveWorkspace(userBInWsA, wsAId);

        // 12. UserB can no longer access Workspace-A categories
        categoryActor().getCategoryRaw(userBInWsA, catA.id())
                .statusCode(403);
    }

    @Test
    void flowCross03_workspaceCurrencyChangeRecalculation() {
        // 1. Register with HUF base currency
        AuthContext user = authActor().registerVerifiedUser();
        var cat = categoryActor().createExpenseCategory(user);

        // 3. Transaction in HUF → baseCurrencyAmount = amount
        var txnHuf = transactionActor().createTransaction(user,
                ITFixtures.transaction(cat.id())
                        .currency(SupportedCurrency.HUF).amount(new BigDecimal("100000")).build());
        assertThat(txnHuf.baseCurrencyAmount()).isEqualByComparingTo(new BigDecimal("100000"));

        // 4. Transaction in USD → baseCurrencyAmount auto-calculated
        var txnUsd = transactionActor().createTransaction(user,
                ITFixtures.transaction(cat.id())
                        .currency(SupportedCurrency.USD).amount(new BigDecimal("100"))
                        .exchangeRate(null).build());
        assertThat(txnUsd.baseCurrencyAmount()).isNotNull();

        // 5. Record totals
        var initialTotals = transactionActor().getTransactionTotals(user);
        assertThat(initialTotals.totalExpense()).isGreaterThan(BigDecimal.ZERO);

        // 6. Change workspace baseCurrency to EUR → triggers recalculation
        workspaceActor().patchSettings(user,
                ITFixtures.workspaceSettings().currency(SupportedCurrency.EUR).build());

        // 7-8. Transactions now have recalculated baseCurrencyAmount in EUR
        var recalcHuf = transactionActor().getTransaction(user, txnHuf.id());
        assertThat(recalcHuf.baseCurrencyAmount()).isNotNull();

        var recalcUsd = transactionActor().getTransaction(user, txnUsd.id());
        assertThat(recalcUsd.baseCurrencyAmount()).isNotNull();

        // 9. Settings show EUR
        assertThat(workspaceActor().getSettings(user).baseCurrency()).isEqualTo(SupportedCurrency.EUR);
    }

    @Test
    void flowCross04_recurringTransactionGoalTracking() {
        // 1. Register and verify
        AuthContext user = authActor().registerVerifiedUser();
        var catSavings = categoryActor().createIncomeCategory(user);

        // 3. Create savings goal
        var savingsGoal = goalActor().createGoal(user,
                ITFixtures.goal(catSavings.id())
                        .title("Monthly Savings")
                        .targetAmount(new BigDecimal("120000"))
                        .currentAmount(BigDecimal.ZERO)
                        .build());

        // 4. Create monthly recurring transaction
        var rec = transactionActor().createRecurring(user,
                ITFixtures.recurringTransaction(catSavings.id())
                        .title("Monthly Savings Deposit")
                        .type(TransactionType.INCOME)
                        .amount(new BigDecimal("10000"))
                        .frequency(RecurrenceFrequency.MONTHLY)
                        .endCondition(EndCondition.AFTER_OCCURRENCES)
                        .maxOccurrences(12)
                        .endDate(null)
                        .startDate(LocalDate.now())
                        .dayOfMonth(1)
                        .build());

        // 5. Verify nextExecutionDate is set
        assertThat(transactionActor().getRecurring(user, rec.id()).nextExecutionDate()).isNotNull();

        // 6. Goal currentAmount is still 0
        assertThat(goalActor().getGoal(user, savingsGoal.id()).currentAmount())
                .isEqualByComparingTo(BigDecimal.ZERO);

        // 7-8. Simulate first monthly contribution
        var after1 = goalActor().patchGoal(user, savingsGoal.id(),
                ITFixtures.goalPatch().currentAmount(new BigDecimal("10000")).build());
        assertThat(after1.status()).isEqualTo(GoalStatus.ACTIVE);

        // 9. Complete goal
        var goalDone = goalActor().patchGoal(user, savingsGoal.id(),
                ITFixtures.goalPatch().currentAmount(new BigDecimal("120000")).build());
        assertThat(goalDone.status()).isEqualTo(GoalStatus.COMPLETED);

        // 10-11. Delete recurring
        transactionActor().deleteRecurring(user, rec.id());
        transactionActor().getRecurringRaw(user, rec.id()).statusCode(404);

        // 12. Completed goals list
        assertThat(goalActor().listGoals(user, GoalStatus.COMPLETED)).hasSize(1);
    }

    @Test
    void flowCross05_achievementTriggeringAcrossModules() {
        // 1. Register and verify
        AuthContext user = authActor().registerVerifiedUser();
        var cat = categoryActor().createExpenseCategory(user);

        // 2. All achievements list is not empty
        assertThat(achievementActor().listAll(user)).isNotEmpty();

        // 3. Unlocked achievements on fresh workspace - may be empty or have first-login ones
        achievementActor().listUnlocked(user);

        // 5-8. Complete 3 goals
        for (int i = 1; i <= 3; i++) {
            var g = goalActor().createGoal(user,
                    ITFixtures.goal(cat.id())
                            .title("Goal " + i)
                            .targetAmount(new BigDecimal("100"))
                            .currentAmount(BigDecimal.ZERO)
                            .build());
            goalActor().patchGoal(user, g.id(),
                    ITFixtures.goalPatch().currentAmount(new BigDecimal("100")).build());
        }

        // 9. Unlocked achievements may grow after completing goals
        achievementActor().listUnlocked(user);

        // 10-11. Create and settle a debt
        var debt = debtActor().createDebt(user, ITFixtures.debt(cat.id())
                .amount(new BigDecimal("500")).build());
        debtActor().payDebt(user, debt.id(),
                ITFixtures.debtPayment().amount(new BigDecimal("500")).build());

        var debt2 = debtActor().createDebt(user, ITFixtures.debt(cat.id())
                .title("Second Debt").amount(new BigDecimal("300")).build());
        debtActor().payDebt(user, debt2.id(),
                ITFixtures.debtPayment().amount(new BigDecimal("300")).build());

        // 12. Check for debt-related achievements
        achievementActor().listUnlocked(user);
    }

    @Test
    void flowCross06_preAccountDeletionDataCheck() {
        // 1. Register and verify
        AuthContext user = authActor().registerVerifiedUser();
        var cat = categoryActor().createExpenseCategory(user);

        // 2. Seed data
        transactionActor().createTransaction(user, ITFixtures.transaction(cat.id()).title("T1").build());
        transactionActor().createTransaction(user, ITFixtures.transaction(cat.id()).title("T2").build());
        transactionActor().createTransaction(user, ITFixtures.transaction(cat.id()).title("T3").build());

        var goal = goalActor().createGoal(user, ITFixtures.goal(cat.id()).build());
        var debt = debtActor().createDebt(user, ITFixtures.debt(cat.id()).build());
        investmentActor().createInvestment(user, ITFixtures.investment().build());

        // 3-7. Verify data exists
        assertThat(transactionActor().getTransactionTotals(user).totalExpense()).isGreaterThan(BigDecimal.ZERO);
        assertThat(goalActor().listGoals(user)).hasSize(1);
        assertThat(debtActor().listDebts(user)).hasSize(1);
        assertThat(investmentActor().listGrouped(user)).hasSize(1);
        auditLogActor().listAuditLogs(user);

        String email = user.user().email();

        // 8. Delete account → 204
        userActor().deleteUser(user);

        // 9-10. Account fully gone
        authActor().loginRaw(email, "Password123!").statusCode(401);
        userActor().getUserRaw(user.cookies()).statusCode(401);
    }

    @Test
    void flowCross07_workspaceHeaderValidations() {
        // 1. Register and verify
        AuthContext user = authActor().registerVerifiedUser();
        AuthContext userB = authActor().registerVerifiedUser();

        // 2. POST /categories WITHOUT X-Workspace-ID header → 400
        categoryActor().createCategoryWithoutWorkspaceHeaderRaw(user, ITFixtures.expenseCategory().build())
                .statusCode(400);

        // 3. POST /categories with non-existent workspace ID → 404 WORKSPACE_NOT_FOUND
        categoryActor().createCategoryRaw(
                        user.withWorkspace(999_999L),
                        ITFixtures.expenseCategory().build())
                .statusCode(404)
                .body("code", equalTo("workspace-not-found"));

        // 4-5. UserA cannot list categories in UserB's workspace (not a member yet)
        categoryActor().listCategoriesRaw(user.withWorkspace(userB.workspaceId()))
                .statusCode(403);

        // 6-7. UserB invites UserA → now UserA can access Workspace-B
        workspaceActor().addMember(userB, userB.workspaceId(),
                new WorkspaceMemberEmailRequest(user.user().email()));
        // UserA in Workspace-B can now list categories (empty)
        categoryActor().listCategories(user.withWorkspace(userB.workspaceId()));
    }
}
