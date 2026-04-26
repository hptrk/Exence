package com.exence.finance.integration.actors;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.transaction.dto.RecurringTransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionGetDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.TransactionGetDTO;
import com.exence.finance.modules.transaction.dto.TransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionTotalsResponse;
import com.exence.finance.modules.transaction.dto.TransactionType;
import io.restassured.config.RestAssuredConfig;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Domain DSL for transaction and recurring transaction operations.
 *
 * <p>Encapsulates RestAssured calls for: create, get, list, patch, and delete transactions,
 * as well as full CRUD for recurring transactions.
 */
public class TransactionActor extends BaseActor {

    public TransactionActor(RestAssuredConfig config) {
        super(config);
    }

    // -------------------------------------------------------------------------
    // Transactions
    // -------------------------------------------------------------------------

    /** Creates a transaction and returns the created resource. */
    public TransactionGetDTO createTransaction(AuthContext ctx, TransactionCreateDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .post("/transactions")
                .then()
                .statusCode(201)
                .extract()
                .as(TransactionGetDTO.class);
    }

    /** Fetches a transaction by ID. */
    public TransactionGetDTO getTransaction(AuthContext ctx, long id) {
        return inWorkspace(ctx)
                .when()
                .get("/transactions/{id}", id)
                .then()
                .statusCode(200)
                .extract()
                .as(TransactionGetDTO.class);
    }

    /** Returns the first page of transactions for the current workspace. */
    public List<TransactionGetDTO> listTransactions(AuthContext ctx) {
        return inWorkspace(ctx)
                .when()
                .get("/transactions")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("content", TransactionGetDTO.class);
    }

    /** Returns transactions filtered by type. */
    public List<TransactionGetDTO> listByType(AuthContext ctx, TransactionType type) {
        return inWorkspace(ctx)
                .queryParam("type", type.name())
                .when()
                .get("/transactions")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("content", TransactionGetDTO.class);
    }

    /** Returns transactions filtered by category ID. */
    public List<TransactionGetDTO> listByCategory(AuthContext ctx, long categoryId) {
        return inWorkspace(ctx)
                .queryParam("categoryId", categoryId)
                .when()
                .get("/transactions")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("content", TransactionGetDTO.class);
    }

    /** Returns transactions filtered by date range (inclusive). */
    public List<TransactionGetDTO> listByDateRange(AuthContext ctx, LocalDate from, LocalDate to) {
        return inWorkspace(ctx)
                .queryParam("dateFrom", from.toString())
                .queryParam("dateTo", to.toString())
                .when()
                .get("/transactions")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("content", TransactionGetDTO.class);
    }

    /** Returns transactions filtered by amount range (inclusive). */
    public List<TransactionGetDTO> listByAmountRange(AuthContext ctx, BigDecimal min, BigDecimal max) {
        return inWorkspace(ctx)
                .queryParam("amountFrom", min.toPlainString())
                .queryParam("amountTo", max.toPlainString())
                .when()
                .get("/transactions")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("content", TransactionGetDTO.class);
    }

    /** Returns a page of transactions as raw ValidatableResponse for pagination assertions. */
    public ValidatableResponse listTransactionsPageRaw(AuthContext ctx, int page, int size) {
        return inWorkspace(ctx)
                .queryParam("page", page)
                .queryParam("size", size)
                .when()
                .get("/transactions")
                .then();
    }

    /** Returns transactions filtered by recurring transaction type. */
    public List<RecurringTransactionGetDTO> listRecurringByType(AuthContext ctx, TransactionType type) {
        RequestSpecification req = inWorkspace(ctx).queryParam("type", type.name());
        return req.when()
                .get("/transactions/recurring")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("content", RecurringTransactionGetDTO.class);
    }

    /** Updates a transaction with the given patch DTO. */
    public TransactionGetDTO patchTransaction(AuthContext ctx, long id, TransactionPatchDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .patch("/transactions/{id}", id)
                .then()
                .statusCode(200)
                .extract()
                .as(TransactionGetDTO.class);
    }

    /** Deletes the transaction with the given ID. */
    public void deleteTransaction(AuthContext ctx, long id) {
        inWorkspace(ctx).when().delete("/transactions/{id}", id).then().statusCode(204);
    }

    /** Returns income/expense totals for the current workspace. */
    public TransactionTotalsResponse getTransactionTotals(AuthContext ctx) {
        return inWorkspace(ctx)
                .when()
                .get("/transactions/totals")
                .then()
                .statusCode(200)
                .extract()
                .as(TransactionTotalsResponse.class);
    }

    /** Fetches a single transaction without asserting status (for 404 testing). */
    public ValidatableResponse getTransactionRaw(AuthContext ctx, long id) {
        return inWorkspace(ctx).when().get("/transactions/{id}", id).then();
    }

    // -------------------------------------------------------------------------
    // Recurring transactions
    // -------------------------------------------------------------------------

    /** Creates a recurring transaction and returns the created resource. */
    public RecurringTransactionGetDTO createRecurring(AuthContext ctx, RecurringTransactionCreateDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .post("/transactions/recurring")
                .then()
                .statusCode(201)
                .extract()
                .as(RecurringTransactionGetDTO.class);
    }

    /** Fetches a recurring transaction by ID. */
    public RecurringTransactionGetDTO getRecurring(AuthContext ctx, long id) {
        return inWorkspace(ctx)
                .when()
                .get("/transactions/recurring/{id}", id)
                .then()
                .statusCode(200)
                .extract()
                .as(RecurringTransactionGetDTO.class);
    }

    /** Returns the first page of recurring transactions for the current workspace. */
    public List<RecurringTransactionGetDTO> listRecurring(AuthContext ctx) {
        return inWorkspace(ctx)
                .when()
                .get("/transactions/recurring")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("content", RecurringTransactionGetDTO.class);
    }

    /** Updates a recurring transaction with the given patch DTO. */
    public RecurringTransactionGetDTO patchRecurring(AuthContext ctx, long id, RecurringTransactionPatchDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .patch("/transactions/recurring/{id}", id)
                .then()
                .statusCode(200)
                .extract()
                .as(RecurringTransactionGetDTO.class);
    }

    /** Deletes the recurring transaction with the given ID. */
    public void deleteRecurring(AuthContext ctx, long id) {
        inWorkspace(ctx)
                .when()
                .delete("/transactions/recurring/{id}", id)
                .then()
                .statusCode(204);
    }

    /** Fetches recurring transaction without asserting status (for 404 testing). */
    public ValidatableResponse getRecurringRaw(AuthContext ctx, long id) {
        return inWorkspace(ctx).when().get("/transactions/recurring/{id}", id).then();
    }

    /** Creates recurring transaction without asserting status (for validation error testing). */
    public ValidatableResponse createRecurringRaw(AuthContext ctx, RecurringTransactionCreateDTO dto) {
        return inWorkspace(ctx).body(dto).when().post("/transactions/recurring").then();
    }
}
