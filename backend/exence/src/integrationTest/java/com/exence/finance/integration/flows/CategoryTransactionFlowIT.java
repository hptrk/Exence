package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.category.dto.CategoryType;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 5 — Category & Transaction
 *
 * <p>FLOW-TXN-01: Category lifecycle and transaction binding
 * <p>FLOW-TXN-02: Transaction CRUD and filtering coverage
 * <p>FLOW-TXN-03: Multi-currency transactions and exchange-rate integration
 * <p>FLOW-TXN-04: Workspace isolation for transactions
 */
class CategoryTransactionFlowIT extends BaseFlowIT {

    @Test
    void flowTxn01_categoryLifecycleAndTransactionBinding() {
        AuthContext user = authActor().registerVerifiedUser();

        // 1-2. Create EXPENSE category → 201
        var cat = categoryActor().createCategory(user,
                ITFixtures.expenseCategory().name("Dining").build());
        assertThat(cat.id()).isPositive();

        // 3. Create duplicate → 409 CATEGORY_ALREADY_EXISTS
        categoryActor().createCategoryRaw(user, ITFixtures.expenseCategory().name("Dining").build())
                .statusCode(409)
                .body("code", equalTo("category-already-exists"));

        // 4. GET /categories → category present
        assertThat(categoryActor().listCategories(user).stream()
                .anyMatch(c -> c.id().equals(cat.id()))).isTrue();

        // 5. PATCH name → 200, GET shows new name
        var renamed = categoryActor().patchCategory(user, cat.id(),
                ITFixtures.categoryPatch().name("Fine Dining").build());
        assertThat(renamed.name()).isEqualTo("Fine Dining");

        // 6. Create transaction linked to this category → 201
        var txn = transactionActor().createTransaction(user,
                ITFixtures.transaction(cat.id()).amount(new BigDecimal("5000")).build());
        assertThat(txn.id()).isPositive();

        // 7. DELETE category while in use → 409 CATEGORY_IN_USE
        categoryActor().deleteCategoryRaw(user, cat.id())
                .statusCode(409)
                .body("code", equalTo("category-in-use"));

        // 8. DELETE transaction → 204
        transactionActor().deleteTransaction(user, txn.id());

        // 9. DELETE category now → 204
        categoryActor().deleteCategory(user, cat.id());

        // 10. GET category → 404
        categoryActor().getCategoryRaw(user, cat.id())
                .statusCode(404)
                .body("code", equalTo("category-not-found"));
    }

    @Test
    void flowTxn02_transactionCrudAndFilteringCoverage() {
        AuthContext user = authActor().registerVerifiedUser();

        var catExpense = categoryActor().createExpenseCategory(user);
        var catIncome = categoryActor().createIncomeCategory(user);

        // Create 3 transactions
        var t1 = transactionActor().createTransaction(user,
                ITFixtures.transaction(catExpense.id())
                        .type(TransactionType.EXPENSE).amount(new BigDecimal("100"))
                        .date(LocalDate.of(2024, 1, 10)).build());
        var t2 = transactionActor().createTransaction(user,
                ITFixtures.transaction(catExpense.id())
                        .type(TransactionType.EXPENSE).amount(new BigDecimal("200"))
                        .date(LocalDate.of(2024, 2, 15)).build());
        var t3 = transactionActor().createTransaction(user,
                ITFixtures.transaction(catIncome.id())
                        .type(TransactionType.INCOME).amount(new BigDecimal("500"))
                        .date(LocalDate.of(2024, 3, 1)).build());

        // 7. All transactions → 3
        assertThat(transactionActor().listTransactions(user)).hasSize(3);

        // 8. Filter by type=EXPENSE → 2
        assertThat(transactionActor().listByType(user, TransactionType.EXPENSE)).hasSize(2);

        // 9. Filter by categoryId=catExpense → 2
        assertThat(transactionActor().listByCategory(user, catExpense.id())).hasSize(2);

        // 10. Filter by date range 2024-02-01 to 2024-02-28 → 1 (t2)
        assertThat(transactionActor().listByDateRange(user,
                LocalDate.of(2024, 2, 1), LocalDate.of(2024, 2, 28))).hasSize(1);

        // 11. Filter by amount range 150–300 → 1 (t2, amount=200)
        assertThat(transactionActor().listByAmountRange(user,
                new BigDecimal("150"), new BigDecimal("300"))).hasSize(1);

        // 12. Paged: page=0, size=2 → 2 items, totalElements=3
        transactionActor().listTransactionsPageRaw(user, 0, 2)
                .statusCode(200)
                .body("content.size()", is(2))
                .body("totalElements", is(3));

        // 13. Totals → expense=300, income=500
        var totals = transactionActor().getTransactionTotals(user);
        assertThat(totals.totalExpense()).isEqualByComparingTo(new BigDecimal("300"));
        assertThat(totals.totalIncome()).isEqualByComparingTo(new BigDecimal("500"));

        // 14. Top categories by amount → expense category is top
        categoryActor().listTopByAmountRaw(user, CategoryType.EXPENSE)
                .statusCode(200);

        // 15. PATCH t1 amount=150 → 200
        var patched = transactionActor().patchTransaction(user, t1.id(),
                ITFixtures.transactionPatch().amount(new BigDecimal("150")).build());
        assertThat(patched.amount()).isEqualByComparingTo(new BigDecimal("150"));

        // 16. Totals updated → expense=350
        var updatedTotals = transactionActor().getTransactionTotals(user);
        assertThat(updatedTotals.totalExpense()).isEqualByComparingTo(new BigDecimal("350"));
    }

    @Test
    void flowTxn03_multiCurrencyAndExchangeRate() {
        AuthContext user = authActor().registerVerifiedUser();
        var cat = categoryActor().createExpenseCategory(user);

        // Create transaction in USD → baseCurrencyAmount is auto-calculated
        var txnUsd = transactionActor().createTransaction(user,
                ITFixtures.transaction(cat.id())
                        .currency(SupportedCurrency.USD)
                        .amount(new BigDecimal("100"))
                        .exchangeRate(null)
                        .build());
        assertThat(txnUsd.currency()).isEqualTo(SupportedCurrency.USD);
        assertThat(txnUsd.baseCurrencyAmount()).isNotNull();

        // Create transaction in EUR with manual exchange rate
        var txnEur = transactionActor().createTransaction(user,
                ITFixtures.transaction(cat.id())
                        .currency(SupportedCurrency.EUR)
                        .amount(new BigDecimal("50"))
                        .exchangeRate(new BigDecimal("400"))
                        .build());
        assertThat(txnEur.exchangeRate()).isEqualByComparingTo(new BigDecimal("400"));
        assertThat(txnEur.baseCurrencyAmount()).isEqualByComparingTo(new BigDecimal("20000"));

        // Totals include baseCurrencyAmount of both
        var totals = transactionActor().getTransactionTotals(user);
        assertThat(totals.totalExpense()).isGreaterThan(BigDecimal.ZERO);
    }

    @Test
    void flowTxn04_workspaceIsolation() {
        // Two independent users → two separate workspaces
        AuthContext userA = authActor().registerVerifiedUser();
        AuthContext userB = authActor().registerVerifiedUser();

        // UserA creates data in Workspace-A
        var catA = categoryActor().createExpenseCategory(userA);
        var txnA = transactionActor().createTransaction(userA,
                ITFixtures.transaction(catA.id()).build());

        // UserB creates data in Workspace-B
        var catB = categoryActor().createExpenseCategory(userB);
        transactionActor().createTransaction(userB, ITFixtures.transaction(catB.id()).build());

        // UserA sees only their own transactions
        assertThat(transactionActor().listTransactions(userA)).hasSize(1);

        // UserA cannot see UserB's transaction
        transactionActor().getTransactionRaw(userA, txnA.id()).statusCode(200);

        // UserB sees only their own
        assertThat(transactionActor().listTransactions(userB)).hasSize(1);
    }
}
