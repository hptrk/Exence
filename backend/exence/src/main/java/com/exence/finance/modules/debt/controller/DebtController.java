package com.exence.finance.modules.debt.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtGetDTO;
import com.exence.finance.modules.debt.dto.DebtPatchDTO;
import com.exence.finance.modules.debt.dto.DebtPaymentDTO;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface DebtController {

    @ExenceOpenApi(
            summary = "List debts",
            description = "Returns debts for the authenticated user. The optional `statuses` query parameter filters"
                + " by one or more debt statuses. The optional `type` parameter filters by debt direction. Parameters"
                + " can be combined. If both are omitted, all debts are returned.",
            successStatus = 200,
            successDescription = "List of debts returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.EMAIL_VERIFICATION_REQUIRED})
    ResponseEntity<List<DebtGetDTO>> getDebts(List<DebtStatus> statuses, DebtType type);

    @ExenceOpenApi(
            summary = "Get a debt by ID",
            description = "Returns a single debt record belonging to the authenticated user, identified by its ID.",
            successStatus = 200,
            successDescription = "Debt returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.EMAIL_VERIFICATION_REQUIRED, ErrorCode.DEBT_NOT_FOUND})
    ResponseEntity<DebtGetDTO> getDebtById(Long id);

    @ExenceOpenApi(
            summary = "Create a new debt",
            description = "Creates a new debt record for the authenticated user. The original amount is also converted"
                    + " and stored in the user's base currency using the current exchange rate. The debt is"
                    + " initialised with ACTIVE status and the remaining amount equal to the original amount.",
            successStatus = 201,
            successDescription = "Debt created; Location header points to the new resource.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.EMAIL_VERIFICATION_REQUIRED,
                ErrorCode.CATEGORY_NOT_FOUND,
                ErrorCode.EXCHANGE_RATE_NOT_AVAILABLE,
                ErrorCode.EXCHANGE_RATE_FETCH_FAILED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<DebtGetDTO> createDebt(DebtCreateDTO dto);

    @ExenceOpenApi(
            summary = "Update a debt",
            description =
                    "Partially updates a debt record identified by its ID. The request body can include any subset"
                            + " of updatable fields. Only the provided fields will be updated.",
            successStatus = 200,
            successDescription = "Updated debt returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.EMAIL_VERIFICATION_REQUIRED,
                ErrorCode.DEBT_NOT_FOUND,
                ErrorCode.CATEGORY_NOT_FOUND,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<DebtGetDTO> patchDebt(Long id, DebtPatchDTO dto);

    @ExenceOpenApi(
            summary = "Record a debt payment",
            description =
                    "Applies a partial or full payment to a debt identified by its ID. The payment amount must not"
                            + " exceed the current remaining amount. The remaining amount (and its base-currency"
                            + " equivalent) is reduced accordingly. If the remaining amount reaches zero, the debt"
                            + " is automatically set to SETTLED status.",
            successStatus = 200,
            successDescription = "Updated debt with new remaining amount returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.EMAIL_VERIFICATION_REQUIRED,
                ErrorCode.DEBT_NOT_FOUND,
                ErrorCode.DEBT_PAYMENT_EXCEEDS_REMAINING,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<DebtGetDTO> makePayment(Long id, DebtPaymentDTO dto);

    @ExenceOpenApi(
            summary = "Delete a debt",
            description = "Permanently deletes a debt record identified by its ID.",
            successStatus = 204,
            successDescription = "Debt deleted successfully.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.EMAIL_VERIFICATION_REQUIRED, ErrorCode.DEBT_NOT_FOUND})
    ResponseEntity<Void> deleteDebt(Long id);

    @ExenceOpenApi(
            summary = "Get debt statistics widget data",
            description = "Returns the data payload for the specified debt statistics widget type. Widget types cover"
                    + " aggregated debt metrics.",
            successStatus = 200,
            successDescription = "Debt widget data payload returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.EMAIL_VERIFICATION_REQUIRED,
                ErrorCode.DEBT_WIDGET_TYPE_NOT_SUPPORTED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<DebtWidgetDataResponse> getWidgetData(DebtWidgetType type);
}
