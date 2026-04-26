package com.exence.finance.modules.auth.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.fixtures.AuthTestFixtures;
import com.exence.finance.modules.auth.controller.impl.AuthControllerImpl;
import com.exence.finance.modules.auth.dto.request.EmailVerificationRequest;
import com.exence.finance.modules.auth.dto.request.ForgotPasswordRequest;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.PasswordResetRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.AuthService;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.ResponseCookie;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(AuthControllerImpl.class)
@WithMockUser
class AuthControllerTest extends BaseControllerTest {

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // UniqueEmailValidator uses userRepository, allow any email by default
        given(userRepository.findByEmail(org.mockito.ArgumentMatchers.anyString()))
                .willReturn(Optional.empty());
        given(cookieService.createAccessTokenCookie(org.mockito.ArgumentMatchers.anyString()))
                .willReturn(ResponseCookie.from("access_token", "token-value").build());
        given(cookieService.createRefreshTokenCookie(org.mockito.ArgumentMatchers.anyString()))
                .willReturn(ResponseCookie.from("refresh_token", "token-value").build());
    }

    // --- POST /api/auth/register ---

    @Test
    @DisplayName("POST /api/auth/register - returns 200 with user and workspace id")
    void register() throws Exception {
        // given
        RegisterRequest request = AuthTestFixtures.registerRequest();
        AuthenticationResponse response = AuthTestFixtures.authResponse();
        given(authService.register(request)).willReturn(response);

        // when
        ResultActions result = performPostNoWorkspace("/api/auth/register", request);

        // then
        result.andExpect(status().isOk());
        AuthenticationResponse body = fromJson(result, AuthenticationResponse.class);
        assertThat(body.user().username()).isEqualTo(response.user().username());
        assertThat(body.workspaceId()).isEqualTo(response.workspaceId());
    }

    @Test
    @DisplayName("POST /api/auth/register - 400 when username is blank")
    void register_blankUsername_returns400() throws Exception {
        // given
        RegisterRequest request =
                new RegisterRequest("", "test@example.com", "Password123!", "Password123!", null, "My Workspace");

        // when
        ResultActions result = performPostNoWorkspace("/api/auth/register", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("username");
    }

    @Test
    @DisplayName("POST /api/auth/register - 400 when email is blank")
    void register_blankEmail_returns400() throws Exception {
        // given
        RegisterRequest request =
                new RegisterRequest("TestUser", "", "Password123!", "Password123!", null, "My Workspace");

        // when
        ResultActions result = performPostNoWorkspace("/api/auth/register", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("email");
    }

    @Test
    @DisplayName("POST /api/auth/register - 400 when passwords do not match")
    void register_passwordMismatch_returns400() throws Exception {
        // given
        RegisterRequest request = new RegisterRequest(
                "TestUser", "test@example.com", "Password123!", "Different1!", null, "My Workspace");

        // when
        ResultActions result = performPostNoWorkspace("/api/auth/register", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("confirmPassword");
    }

    @Test
    @DisplayName("POST /api/auth/register - 400 when workspace name is blank")
    void register_blankWorkspaceName_returns400() throws Exception {
        // given
        RegisterRequest request =
                new RegisterRequest("TestUser", "test@example.com", "Password123!", "Password123!", null, "");

        // when
        ResultActions result = performPostNoWorkspace("/api/auth/register", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("workspaceName");
    }

    // --- POST /api/auth/login ---

    @Test
    @DisplayName("POST /api/auth/login - returns 200 with auth response")
    void login() throws Exception {
        // given
        LoginRequest request = AuthTestFixtures.loginRequest();
        AuthenticationResponse response = AuthTestFixtures.authResponse();
        given(authService.login(request)).willReturn(response);

        // when
        ResultActions result = performPostNoWorkspace("/api/auth/login", request);

        // then
        result.andExpect(status().isOk());
        AuthenticationResponse body = fromJson(result, AuthenticationResponse.class);
        assertThat(body.user().email()).isEqualTo(response.user().email());
    }

    @Test
    @DisplayName("POST /api/auth/login - 400 when email is blank")
    void login_blankEmail_returns400() throws Exception {
        // given
        LoginRequest request = new LoginRequest("", "Password123!");

        // when
        ResultActions result = performPostNoWorkspace("/api/auth/login", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("email");
    }

    @Test
    @DisplayName("POST /api/auth/login - 400 when password is blank")
    void login_blankPassword_returns400() throws Exception {
        // given
        LoginRequest request = new LoginRequest("test@example.com", "");

        // when
        ResultActions result = performPostNoWorkspace("/api/auth/login", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("password");
    }

    // --- POST /api/auth/forgot-password ---

    @Test
    @DisplayName("POST /api/auth/forgot-password - returns 204")
    void forgotPassword() throws Exception {
        // given
        ForgotPasswordRequest request = new ForgotPasswordRequest("test@example.com");
        willDoNothing().given(authService).forgotPassword(request);

        // when / then
        performPostNoWorkspace("/api/auth/forgot-password", request).andExpect(status().isNoContent());
    }

    // --- POST /api/auth/verify-email ---

    @Test
    @DisplayName("POST /api/auth/verify-email - 400 when token is blank")
    void verifyEmail_blankToken_returns400() throws Exception {
        // given
        EmailVerificationRequest request = new EmailVerificationRequest("");

        // when
        ResultActions result = performPostNoWorkspace("/api/auth/verify-email", request);

        // then
        result.andExpect(status().isBadRequest());
    }

    // --- POST /api/auth/reset-password ---

    @Test
    @DisplayName("POST /api/auth/reset-password - 400 when token is blank")
    void resetPassword_blankToken_returns400() throws Exception {
        // given
        PasswordResetRequest request = new PasswordResetRequest("", "NewPassword456!", "NewPassword456!");

        // when
        ResultActions result = performPostNoWorkspace("/api/auth/reset-password", request);

        // then
        result.andExpect(status().isBadRequest());
    }
}
