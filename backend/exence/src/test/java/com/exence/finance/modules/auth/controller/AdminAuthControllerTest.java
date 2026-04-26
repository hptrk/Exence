package com.exence.finance.modules.auth.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.fixtures.AuthTestFixtures;
import com.exence.finance.modules.auth.controller.impl.AdminAuthControllerImpl;
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

@WebMvcTest(AdminAuthControllerImpl.class)
class AdminAuthControllerTest extends BaseControllerTest {

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private UserRepository userRepository;

    @BeforeEach
    void stubDependencies() {
        given(userRepository.findByEmail(anyString())).willReturn(Optional.empty());
        given(cookieService.createAccessTokenCookie(anyString()))
                .willReturn(ResponseCookie.from("access_token", "token-value").build());
        given(cookieService.createRefreshTokenCookie(anyString()))
                .willReturn(ResponseCookie.from("refresh_token", "token-value").build());
    }

    // --- POST /api/admin/auth/register ---

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/admin/auth/register - registers admin and returns auth response")
    void registerAdmin() throws Exception {
        // given
        RegisterRequest request = AuthTestFixtures.registerRequest();
        AuthenticationResponse response = AuthTestFixtures.authResponse();
        given(authService.registerAdmin(request)).willReturn(response);

        // when
        ResultActions result = performPostNoWorkspace("/api/admin/auth/register", request);

        // then
        result.andExpect(status().isOk());
        AuthenticationResponse body = fromJson(result, AuthenticationResponse.class);
        assertThat(body.user().username()).isEqualTo("TestUser");
    }

    @Test
    @DisplayName("POST /api/admin/auth/register - 401 when unauthenticated")
    void registerAdmin_unauthenticated_returns401() throws Exception {
        performPostNoWorkspace("/api/admin/auth/register", AuthTestFixtures.registerRequest())
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/admin/auth/register - 400 when username is blank")
    void registerAdmin_blankUsername_returns400() throws Exception {
        // given
        RegisterRequest request = new RegisterRequest(
                "", "admin@example.com", "Password123!", "Password123!", SupportedCurrency.HUF, "Admin Workspace");

        // when
        ResultActions result = performPostNoWorkspace("/api/admin/auth/register", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("username");
    }
}
