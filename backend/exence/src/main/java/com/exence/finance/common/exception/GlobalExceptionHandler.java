package com.exence.finance.common.exception;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import io.jsonwebtoken.ExpiredJwtException;
import java.net.URI;
import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final String PROBLEM_BASE_URI = "https://api.exence.com/problems/";

    private final I18nService i18n;

    @ExceptionHandler(ExenceException.class)
    public ResponseEntity<ProblemDetail> handleExenceException(ExenceException ex, WebRequest request) {
        ErrorCode code = ex.getErrorCode();

        if (code.getStatus().is5xxServerError()) {
            log.error("ExenceException [{}]: {}", code, ex.getMessage(), ex);
        } else {
            log.warn("ExenceException [{}]: {}", code, ex.getMessage());
        }

        String detail = i18n.get(ex.getResolvedMessageKey(), ex.getArgs());

        return buildResponse(code, detail);
    }

    // Built-in exceptions

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        ErrorCode widgetTypeErrorCode = resolveWidgetTypeErrorCode(ex.getRequiredType());
        if (widgetTypeErrorCode != null) {
            String detail = i18n.get(widgetTypeErrorCode.getMessageKey());
            return (ResponseEntity) buildResponse(widgetTypeErrorCode, detail);
        }

        return ResponseEntity.badRequest().build();
    }

    private ErrorCode resolveWidgetTypeErrorCode(Class<?> requiredType) {
        if (requiredType == null) {
            return null;
        }

        return switch (requiredType) {
            case Class<?> type when type.equals(InvestmentWidgetType.class) -> ErrorCode.INVESTMENT_WIDGET_TYPE_NOT_SUPPORTED;
            case Class<?> type when type.equals(DebtWidgetType.class) -> ErrorCode.DEBT_WIDGET_TYPE_NOT_SUPPORTED;
            case Class<?> type when type.equals(GoalWidgetType.class) -> ErrorCode.GOAL_WIDGET_TYPE_NOT_SUPPORTED;
            case Class<?> type when type.equals(AdminWidgetType.class) -> ErrorCode.ADMIN_WIDGET_TYPE_NOT_SUPPORTED;
            default -> null;
        };
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {

        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        error -> error.getField(),
                        error -> error.getDefaultMessage(),
                        (existing, replacement) -> existing));

        log.warn("Validation failed for request. Errors: {}", errors);

        ErrorCode code = ErrorCode.VALIDATION_ERROR;
        String detail = i18n.get(code.getMessageKey());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, detail);
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + code.getProblemSlug()));
        problemDetail.setTitle(i18n.get(code.getTitleKey()));
        problemDetail.setProperty("timestamp", Instant.now());
        problemDetail.setProperty("errors", errors);
        problemDetail.setProperty("code", code.getProblemSlug());

        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ProblemDetail> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        log.warn("Authentication failed - bad credentials provided");

        ErrorCode code = ErrorCode.INVALID_CREDENTIALS;
        String detail = i18n.get(code.getMessageKey());

        return buildResponse(code, detail);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        log.warn("Access denied to resource: {}", request.getDescription(false));

        ErrorCode code = ErrorCode.ACCESS_DENIED;
        String detail = i18n.get(code.getMessageKey());

        return buildResponse(code, detail);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        log.warn("Illegal argument provided: {}", ex.getMessage());

        ErrorCode code = ErrorCode.ILLEGAL_ARGUMENT;
        String detail = i18n.get(code.getMessageKey());

        return buildResponse(code, detail);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ProblemDetail> handleExpiredJwtException(ExpiredJwtException ex, WebRequest request) {
        log.warn("JWT token has expired for request: {}", request.getDescription(false));

        ErrorCode code = ErrorCode.JWT_TOKEN_EXPIRED;
        String detail = i18n.get(code.getMessageKey());

        return buildResponse(code, detail);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleGenericException(Exception ex, WebRequest request) {
        log.error("Unexpected error occurred: {}", ex.getMessage(), ex);

        ErrorCode code = ErrorCode.INTERNAL_SERVER_ERROR;
        String detail = i18n.get(code.getMessageKey());

        return buildResponse(code, detail);
    }

    private ResponseEntity<ProblemDetail> buildResponse(ErrorCode code, String detail) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(code.getStatus(), detail);
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + code.getProblemSlug()));
        problemDetail.setTitle(i18n.get(code.getTitleKey()));
        problemDetail.setProperty("timestamp", Instant.now());
        problemDetail.setProperty("code", code.getProblemSlug());

        return ResponseEntity.status(code.getStatus()).body(problemDetail);
    }
}
