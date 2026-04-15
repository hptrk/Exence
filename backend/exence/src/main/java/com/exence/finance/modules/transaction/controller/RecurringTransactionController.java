package com.exence.finance.modules.transaction.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.dto.PageResponse;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.transaction.dto.RecurringTransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionGetDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionType;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

@Tag(name = "Recurring Transactions", description = "Recurring transaction rule management")
public interface RecurringTransactionController {

    @ExenceOpenApi(
            summary = "Get a recurring transaction by ID",
            description = "Returns a single recurring transaction rule belonging to the authenticated user, identified"
                    + " by its ID.",
            successStatus = 200,
            successDescription = "Recurring transaction returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.RECURRING_TRANSACTION_NOT_FOUND})
    ResponseEntity<RecurringTransactionGetDTO> getById(Long id);

    @ExenceOpenApi(
            summary = "List recurring transactions (paginated)",
            description =
                    "Returns a paginated list of all recurring transaction rules with their transaction types for the authenticated user."
                            + " Sorted by next execution date ascending by default so the nearest upcoming"
                            + " transactions appear first.",
            successStatus = 200,
            successDescription = "Paginated list of recurring transactions returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<PageResponse<RecurringTransactionGetDTO>> getAll(Pageable pageable, TransactionType type);

    @ExenceOpenApi(
            summary = "Create a recurring transaction",
            description =
                    "Creates a new recurring transaction rule for the authenticated user. The category for which the"
                            + " recurring transactions are created, must already exist. The rule defines the amount,"
                            + " category, frequency, interval, and end condition. The first execution is scheduled for the"
                            + " provided start date.",
            successStatus = 201,
            successDescription = "Recurring transaction created; Location header points to the new resource.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.CATEGORY_NOT_FOUND, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<RecurringTransactionGetDTO> create(RecurringTransactionCreateDTO dto);

    @ExenceOpenApi(
            summary = "Update a recurring transaction",
            description =
                    "Partially updates a recurring transaction rule identified by its ID. Only provided fields are"
                            + " changed. If the frequency or end-condition fields are updated, the related"
                            + " fields are validated for consistency.",
            successStatus = 200,
            successDescription = "Updated recurring transaction returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.RECURRING_TRANSACTION_NOT_FOUND,
                ErrorCode.CATEGORY_NOT_FOUND,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<RecurringTransactionGetDTO> update(Long id, RecurringTransactionPatchDTO dto);

    @ExenceOpenApi(
            summary = "Delete a recurring transaction",
            description = "Permanently deletes a recurring transaction rule identified by its ID. Already-generated"
                    + " transaction entries are not affected.",
            successStatus = 204,
            successDescription = "Recurring transaction deleted successfully.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.RECURRING_TRANSACTION_NOT_FOUND})
    ResponseEntity<Void> delete(Long id);
}
