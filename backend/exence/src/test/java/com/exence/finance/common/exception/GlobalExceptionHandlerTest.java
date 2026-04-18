package com.exence.finance.common.exception;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import com.exence.finance.common.i18n.I18nService;
import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GlobalExceptionHandlerTest {

    private static final String PROBLEM_BASE_URI = "https://api.exence.com/problems/";

    @Mock
    private I18nService i18n;

    @Mock
    private WebRequest webRequest;

    @InjectMocks
    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {
        given(i18n.get(anyString())).willAnswer(inv -> inv.getArgument(0));
        given(i18n.get(anyString(), isNull())).willAnswer(inv -> inv.getArgument(0));
    }

    // --- ExenceException ---

    @Test
    @DisplayName("returns 404 for a 4xx ExenceException")
    void handleExenceException_4xx() {
        ExenceException ex = new ExenceException(ErrorCode.USER_NOT_FOUND);

        ResponseEntity<ProblemDetail> response = handler.handleExenceException(ex, webRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("returns 500 for a 5xx ExenceException")
    void handleExenceException_5xx() {
        ExenceException ex = new ExenceException(ErrorCode.INTERNAL_SERVER_ERROR);

        ResponseEntity<ProblemDetail> response = handler.handleExenceException(ex, webRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("ProblemDetail type URI contains the error slug")
    void handleExenceException_problemDetailTypeContainsSlug() {
        ExenceException ex = new ExenceException(ErrorCode.USER_NOT_FOUND);

        ResponseEntity<ProblemDetail> response = handler.handleExenceException(ex, webRequest);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getType().toString())
                .startsWith(PROBLEM_BASE_URI)
                .contains(ErrorCode.USER_NOT_FOUND.getProblemSlug());
    }

    @Test
    @DisplayName("ProblemDetail has a timestamp property")
    void handleExenceException_hasTimestamp() {
        ExenceException ex = new ExenceException(ErrorCode.USER_NOT_FOUND);

        ResponseEntity<ProblemDetail> response = handler.handleExenceException(ex, webRequest);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getProperties()).containsKey("timestamp");
    }

    // --- BadCredentialsException ---

    @Test
    @DisplayName("returns 401 for BadCredentialsException")
    void handleBadCredentialsException_returns401() {
        BadCredentialsException ex = new BadCredentialsException("bad credentials");

        ResponseEntity<ProblemDetail> response = handler.handleBadCredentialsException(ex, webRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getType().toString()).contains(ErrorCode.INVALID_CREDENTIALS.getProblemSlug());
    }

    // --- AccessDeniedException ---

    @Test
    @DisplayName("returns 403 for AccessDeniedException")
    void handleAccessDeniedException_returns403() {
        AccessDeniedException ex = new AccessDeniedException("forbidden");

        ResponseEntity<ProblemDetail> response = handler.handleAccessDeniedException(ex, webRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody().getType().toString()).contains(ErrorCode.ACCESS_DENIED.getProblemSlug());
    }

    // --- IllegalArgumentException ---

    @Test
    @DisplayName("returns 400 for IllegalArgumentException")
    void handleIllegalArgumentException_returns400() {
        IllegalArgumentException ex = new IllegalArgumentException("bad arg");

        ResponseEntity<ProblemDetail> response = handler.handleIllegalArgumentException(ex, webRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody().getType().toString()).contains(ErrorCode.ILLEGAL_ARGUMENT.getProblemSlug());
    }

    // --- ExpiredJwtException ---

    @Test
    @DisplayName("returns 401 for ExpiredJwtException")
    void handleExpiredJwtException_returns401() {
        ExpiredJwtException ex = new ExpiredJwtException(null, null, "expired");

        ResponseEntity<ProblemDetail> response = handler.handleExpiredJwtException(ex, webRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody().getType().toString()).contains(ErrorCode.JWT_TOKEN_EXPIRED.getProblemSlug());
    }

    // --- Generic Exception ---

    @Test
    @DisplayName("returns 500 for any unhandled Exception")
    void handleGenericException_returns500() {
        Exception ex = new RuntimeException("unexpected");

        ResponseEntity<ProblemDetail> response = handler.handleGenericException(ex, webRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody().getType().toString()).contains(ErrorCode.INTERNAL_SERVER_ERROR.getProblemSlug());
    }

    // --- MethodArgumentNotValidException ---

    @Test
    @DisplayName("returns 400 with field errors map for MethodArgumentNotValidException")
    void handleMethodArgumentNotValid_returnsFieldErrors() {
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "object");
        bindingResult.addError(new FieldError("object", "email", "must not be blank"));
        given(ex.getBindingResult()).willReturn(bindingResult);

        ResponseEntity<Object> response =
                handler.handleMethodArgumentNotValid(ex, new HttpHeaders(), HttpStatus.BAD_REQUEST, webRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        ProblemDetail body = (ProblemDetail) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.getProperties()).containsKey("errors");
        @SuppressWarnings("unchecked")
        var errors = (java.util.Map<String, String>) body.getProperties().get("errors");
        assertThat(errors).containsEntry("email", "must not be blank");
    }
}
