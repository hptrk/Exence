package com.exence.finance.modules.transaction.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.dto.PageResponse;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.transaction.dto.TransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.TransactionFilter;
import com.exence.finance.modules.transaction.dto.TransactionGetDTO;
import com.exence.finance.modules.transaction.dto.TransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionTotalsResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface TransactionController {
    @ExenceOpenApi(
            summary = "Get a transaction by ID",
            description =
                    "Returns a single financial transaction belonging to the authenticated user, identified by its ID.",
            successStatus = 200,
            successDescription = "Transaction returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.TRANSACTION_NOT_FOUND})
    ResponseEntity<TransactionGetDTO> getTransactionById(Long id);

    @ExenceOpenApi(
            summary = "List transactions (paginated)",
            description =
                    "Returns a paginated list of financial transactions for the authenticated user. Results can be"
                            + " filtered by category, type, date range, and amount range using"
                            + " query parameters. Sorted by date descending by default.",
            successStatus = 200,
            successDescription = "Paginated list of transactions returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<PageResponse<TransactionGetDTO>> getTransactions(TransactionFilter filter, Pageable pageable);

    @ExenceOpenApi(
            summary = "Create a new transaction",
            description = "Creates a financial transaction (income or expense) for the authenticated user. The"
                    + " category for which the transaction is created, must already exist. If a non-base currency is"
                    + " specified, the exchange rate for the transaction date is fetched automatically (or can be provided"
                    + " explicitly) and the base-currency amount is calculated and stored.",
            successStatus = 201,
            successDescription = "Transaction created; Location header points to the new resource.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.CATEGORY_NOT_FOUND,
                ErrorCode.EXCHANGE_RATE_NOT_AVAILABLE,
                ErrorCode.EXCHANGE_RATE_FETCH_FAILED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<TransactionGetDTO> createTransaction(TransactionCreateDTO transactionCreateDTO);

    @ExenceOpenApi(
            summary = "Update a transaction",
            description = "Partially updates a financial transaction identified by its ID. Only the fields present in"
                    + " the request body are modified. If the category is changed, the new category must"
                    + " exist. Currency and exchange-rate fields follow the same rules as creation.",
            successStatus = 200,
            successDescription = "Updated transaction returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.TRANSACTION_NOT_FOUND,
                ErrorCode.CATEGORY_NOT_FOUND,
                ErrorCode.EXCHANGE_RATE_NOT_AVAILABLE,
                ErrorCode.EXCHANGE_RATE_FETCH_FAILED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<TransactionGetDTO> updateTransaction(Long id, TransactionPatchDTO transactionPatchDTO);

    @ExenceOpenApi(
            summary = "Delete a transaction",
            description = "Permanently deletes a financial transaction identified by its ID.",
            successStatus = 204,
            successDescription = "Transaction deleted successfully.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.TRANSACTION_NOT_FOUND})
    ResponseEntity<Void> deleteTransaction(Long id);

    @ExenceOpenApi(
            summary = "Get transaction totals",
            description =
                    "Returns the total sum of all income transactions and the total sum of all expense transactions"
                            + " for the authenticated user (in the user's base currency).",
            successStatus = 200,
            successDescription = "Transaction totals returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<TransactionTotalsResponse> getTransactionTotals();
}
