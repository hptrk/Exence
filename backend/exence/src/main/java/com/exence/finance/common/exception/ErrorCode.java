package com.exence.finance.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 401 - Unauthorized
    AUTHENTICATION_FAILED(HttpStatus.UNAUTHORIZED, "authentication-failed"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "invalid-credentials"),
    JWT_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "jwt-token-expired"),
    EMAIL_ALREADY_VERIFIED(HttpStatus.UNAUTHORIZED, "email-already-verified"),

    // 403 - Forbidden
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "access-denied"),
    INVALID_TOKEN(HttpStatus.FORBIDDEN, "invalid-token"),
    EMAIL_VERIFICATION_REQUIRED(HttpStatus.FORBIDDEN, "email-verification-required"),
    WORKSPACE_NOT_FOUND(HttpStatus.FORBIDDEN, "workspace-not-found"),
    WORKSPACE_CANNOT_DELETE_LAST(HttpStatus.FORBIDDEN, "workspace-cannot-delete-last"),
    WORKSPACE_OWNER_CANNOT_LEAVE(HttpStatus.FORBIDDEN, "workspace-owner-cannot-leave"),
    WORKSPACE_OWNER_CANNOT_BE_REMOVED(HttpStatus.FORBIDDEN, "workspace-owner-cannot-be-removed"),
    WORKSPACE_OWNER_REQUIRED(HttpStatus.FORBIDDEN, "workspace-owner-required"),

    // 404 - Not Found
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "user-not-found"),
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "category-not-found"),
    TRANSACTION_NOT_FOUND(HttpStatus.NOT_FOUND, "transaction-not-found"),
    RECURRING_TRANSACTION_NOT_FOUND(HttpStatus.NOT_FOUND, "recurring-transaction-not-found"),
    WIDGET_NOT_FOUND(HttpStatus.NOT_FOUND, "widget-not-found"),
    GOAL_NOT_FOUND(HttpStatus.NOT_FOUND, "goal-not-found"),
    DEBT_NOT_FOUND(HttpStatus.NOT_FOUND, "debt-not-found"),
    ACHIEVEMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "achievement-not-found"),
    INVESTMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "investment-not-found"),

    // 409 - Conflict
    EMAIL_ALREADY_IN_USE(HttpStatus.CONFLICT, "email-already-in-use"),
    WORKSPACE_MEMBER_ALREADY_EXISTS(HttpStatus.CONFLICT, "workspace-member-already-exists"),
    CATEGORY_ALREADY_EXISTS(HttpStatus.CONFLICT, "category-already-exists"),
    CATEGORY_IN_USE(HttpStatus.CONFLICT, "category-in-use"),
    DATA_INTEGRITY_VIOLATION(HttpStatus.CONFLICT, "data-integrity-violation"),

    // 400 - Bad Request
    WORKSPACE_HEADER_MISSING(HttpStatus.BAD_REQUEST, "workspace-header-missing"),
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "invalid-password"),
    WIDGET_TYPE_MISMATCH(HttpStatus.BAD_REQUEST, "widget-type-mismatch"),
    INVALID_WIDGET_SETTING(HttpStatus.BAD_REQUEST, "invalid-widget-setting"),
    ADMIN_WIDGET_TYPE_NOT_SUPPORTED(HttpStatus.BAD_REQUEST, "admin-widget-type-not-supported"),
    GOAL_WIDGET_TYPE_NOT_SUPPORTED(HttpStatus.BAD_REQUEST, "goal-widget-type-not-supported"),
    DEBT_WIDGET_TYPE_NOT_SUPPORTED(HttpStatus.BAD_REQUEST, "debt-widget-type-not-supported"),
    INVESTMENT_WIDGET_TYPE_NOT_SUPPORTED(HttpStatus.BAD_REQUEST, "investment-widget-type-not-supported"),
    DEBT_PAYMENT_EXCEEDS_REMAINING(HttpStatus.BAD_REQUEST, "debt-payment-exceeds-remaining"),
    INVALID_GOAL_SETTING(HttpStatus.BAD_REQUEST, "invalid-goal-setting"),
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "validation-error"),
    ILLEGAL_ARGUMENT(HttpStatus.BAD_REQUEST, "illegal-argument"),
    EXCHANGE_RATE_NOT_AVAILABLE(HttpStatus.BAD_REQUEST, "exchange-rate-not-available"),

    // 429 - Too Many Requests
    TOO_MANY_EMAILS(HttpStatus.TOO_MANY_REQUESTS, "too-many-emails"),

    // 500 - Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "internal-server-error"),

    // 503 - Service Unavailable
    EXCHANGE_RATE_FETCH_FAILED(HttpStatus.SERVICE_UNAVAILABLE, "exchange-rate-fetch-failed");

    private final HttpStatus status;
    private final String problemSlug;

    public String getMessageKey() {
        return "error." + problemSlug;
    }

    public String getTitleKey() {
        return "error." + problemSlug + ".title";
    }
}
