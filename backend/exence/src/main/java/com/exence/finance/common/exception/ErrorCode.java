package com.exence.finance.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 401 - Unauthorized
    AUTHENTICATION_FAILED(HttpStatus.UNAUTHORIZED, "authentication-failed", "Authentication Failed"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "invalid-credentials", "Invalid Credentials"),
    JWT_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "jwt-token-expired", "JWT Token Expired"),
    EMAIL_ALREADY_VERIFIED(HttpStatus.UNAUTHORIZED, "email-already-verified", "Email Already Verified"),

    // 403 - Forbidden
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "access-denied", "Access Denied"),
    INVALID_TOKEN(HttpStatus.FORBIDDEN, "invalid-token", "Invalid Token"),
    EMAIL_VERIFICATION_REQUIRED(HttpStatus.FORBIDDEN, "email-verification-required", "Email Verification Required"),

    // 404 - Not Found
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "user-not-found", "User Not Found"),
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "category-not-found", "Category Not Found"),
    TRANSACTION_NOT_FOUND(HttpStatus.NOT_FOUND, "transaction-not-found", "Transaction Not Found"),
    WIDGET_NOT_FOUND(HttpStatus.NOT_FOUND, "widget-not-found", "Widget Not Found"),

    // 409 - Conflict
    EMAIL_ALREADY_IN_USE(HttpStatus.CONFLICT, "email-already-in-use", "Email Already In Use"),
    CATEGORY_ALREADY_EXISTS(HttpStatus.CONFLICT, "category-already-exists", "Category Already Exists"),
    CATEGORY_IN_USE(HttpStatus.CONFLICT, "category-in-use", "Category In Use"),
    DATA_INTEGRITY_VIOLATION(HttpStatus.CONFLICT, "data-integrity-violation", "Data Integrity Violation"),

    // 400 - Bad Request
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "invalid-password", "Invalid Password"),
    WIDGET_TYPE_MISMATCH(HttpStatus.BAD_REQUEST, "widget-type-mismatch", "Widget Type Mismatch"),
    INVALID_WIDGET_SETTING(HttpStatus.BAD_REQUEST, "invalid-widget-setting", "Invalid Widget Setting"),
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "validation-error", "Validation Error"),
    ILLEGAL_ARGUMENT(HttpStatus.BAD_REQUEST, "illegal-argument", "Illegal Argument"),

    // 429 - Too Many Requests
    TOO_MANY_EMAILS(HttpStatus.TOO_MANY_REQUESTS, "too-many-emails", "Too Many Emails"),

    // 500 - Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "internal-server-error", "Internal Server Error");

    private final HttpStatus status;
    private final String problemSlug;
    private final String title;

    public String getMessageKey() {
        return "error." + problemSlug;
    }

    public String getTitleKey() {
        return "error." + problemSlug + ".title";
    }
}
