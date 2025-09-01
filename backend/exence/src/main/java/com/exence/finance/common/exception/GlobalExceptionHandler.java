package com.exence.finance.common.exception;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.URI;
import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final String PROBLEM_BASE_URI = "https://api.exence.com/problems/";

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleGenericException(Exception ex, WebRequest request) {
        log.error("Unexpected error occurred: {}", ex.getMessage(), ex);

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Unexpected error occurred."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "internal-server-error"));
        problemDetail.setTitle("Internal Server Error");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problemDetail);
    }

    // Built-in exceptions

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        error -> error.getField(),
                        error -> error.getDefaultMessage(),
                        (existing, replacement) -> existing
                ));

        log.warn("Validation failed for request. Errors: {}", errors);

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "The request contains invalid data. Please check the provided fields and try again."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "validation-error"));
        problemDetail.setTitle("Validation Failed");
        problemDetail.setProperty("timestamp", Instant.now());
        problemDetail.setProperty("errors", errors);

        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ProblemDetail> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        log.warn("Authentication failed - bad credentials provided");

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.UNAUTHORIZED,
                "The username or password you entered is incorrect. Please double-check your credentials and try again."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "bad-credentials"));
        problemDetail.setTitle("Invalid Credentials");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problemDetail);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        log.warn("Access denied to resource: {}", request.getDescription(false));

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.FORBIDDEN,
                "You don't have permission to access this resource."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "access-denied"));
        problemDetail.setTitle("Access Denied");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(problemDetail);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ProblemDetail> handleDataIntegrityViolationException(DataIntegrityViolationException ex, WebRequest request) {
        log.warn("Data integrity violation occurred: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                "The operation could not be completed due to a data constraint violation. This usually occurs when trying to delete referenced data."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "data-integrity-violation"));
        problemDetail.setTitle("Data Constraint Violation");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(problemDetail);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        log.warn("Illegal argument provided: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "One or more parameters in your request are invalid. Please check the request format and try again."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "illegal-argument"));
        problemDetail.setTitle("Invalid Request Parameter");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.badRequest().body(problemDetail);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ProblemDetail> handleExpiredJwtException(ExpiredJwtException ex, WebRequest request) {
        log.warn("JWT token has expired for request: {}", request.getDescription(false));

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.UNAUTHORIZED,
                "Your session has expired. Please log in again."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "jwt-expired"));
        problemDetail.setTitle("JWT Token Expired");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problemDetail);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleUsernameNotFoundException(UsernameNotFoundException ex, WebRequest request) {
        log.warn("Username not found during authentication attempt");

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.UNAUTHORIZED,
                "The username or email you entered could not be found. Please check your credentials and try again."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "username-not-found"));
        problemDetail.setTitle("User Not Found");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problemDetail);
    }

    // Custom application errors

    @ExceptionHandler(EmailAlreadyInUseException.class)
    public ResponseEntity<ProblemDetail> handleEmailAlreadyInUseException(EmailAlreadyInUseException ex, WebRequest request) {
        log.warn("Attempt to register with email that is already in use");

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                "This email address is already in use."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "email-conflict"));
        problemDetail.setTitle("Email Already Registered");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(problemDetail);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleUserNotFoundException(UserNotFoundException ex, WebRequest request) {
        log.warn("User not found for request: {}", request.getDescription(false));

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                "The requested user could not be found."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "user-not-found"));
        problemDetail.setTitle("User Not Found");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail);
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleCategoryNotFoundException(CategoryNotFoundException ex, WebRequest request) {
        log.warn("Category not found for request: {}", request.getDescription(false));

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                "Category could not be found."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "category-not-found"));
        problemDetail.setTitle("Category Not Found");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail);
    }

    @ExceptionHandler(CategoryAlreadyExistsException.class)
    public ResponseEntity<ProblemDetail> handleCategoryAlreadyExistsException(CategoryAlreadyExistsException ex, WebRequest request) {
        log.warn("Attempt to create category that already exists");

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                "A category with this name already exists."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "category-conflict"));
        problemDetail.setTitle("Category Already Exists");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(problemDetail);
    }

    @ExceptionHandler(TransactionNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleTransactionNotFoundException(TransactionNotFoundException ex, WebRequest request) {
        log.warn("Transaction not found for request: {}", request.getDescription(false));

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                "Transaction could not be found."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "transaction-not-found"));
        problemDetail.setTitle("Transaction Not Found");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail);
    }

    @ExceptionHandler(AuthenticationFailedException.class)
    public ResponseEntity<ProblemDetail> handleAuthenticationFailedException(AuthenticationFailedException ex, WebRequest request) {
        log.warn("Authentication failed for request: {}", request.getDescription(false));

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.UNAUTHORIZED,
                "Authentication failed. Please check your credentials and try again."
        );
        problemDetail.setType(URI.create(PROBLEM_BASE_URI + "authentication-failed"));
        problemDetail.setTitle("Authentication Failed");
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problemDetail);
    }
}