package com.exence.finance.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.SystemSettingsTestFixtures;
import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import com.exence.finance.modules.systemsettings.service.SystemSettingsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class EmailVerificationInterceptorTest {

    @Mock
    private SystemSettingsService systemSettingsService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private EmailVerificationInterceptor interceptor;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("throws EMAIL_VERIFICATION_REQUIRED when unverified user accesses protected path")
    void intercept_unverifiedOnProtectedPath() {
        // given
        User unverified = UserTestFixtures.unverifiedUser();
        setAuthentication(unverified);
        SystemSettings settings =
                SystemSettingsTestFixtures.systemSettingsWithVerificationRequiredPaths(List.of("/api/transactions"));

        given(systemSettingsService.getSettings()).willReturn(settings);
        given(request.getRequestURI()).willReturn("/api/transactions/list");

        // when / then
        assertThatThrownBy(() -> interceptor.preHandle(request, response, null))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.EMAIL_VERIFICATION_REQUIRED);
    }

    @Test
    @DisplayName("proceeds normally when verified user accesses protected path")
    void intercept_verifiedUser() throws Exception {
        // given
        User verified = UserTestFixtures.defaultUser();
        setAuthentication(verified);
        SystemSettings settings =
                SystemSettingsTestFixtures.systemSettingsWithVerificationRequiredPaths(List.of("/api/transactions"));

        given(systemSettingsService.getSettings()).willReturn(settings);
        given(request.getRequestURI()).willReturn("/api/transactions/list");

        // when
        boolean result = interceptor.preHandle(request, response, null);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("proceeds regardless of verification status on unprotected path")
    void intercept_unprotectedPath() throws Exception {
        // given
        SystemSettings settings =
                SystemSettingsTestFixtures.systemSettingsWithVerificationRequiredPaths(List.of("/api/transactions"));
        given(systemSettingsService.getSettings()).willReturn(settings);
        given(request.getRequestURI()).willReturn("/api/auth/login");

        // when
        boolean result = interceptor.preHandle(request, response, null);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("proceeds when no verification-required paths are configured")
    void intercept_noPaths() throws Exception {
        // given
        SystemSettings settings = SystemSettingsTestFixtures.systemSettingsWithVerificationRequiredPaths(List.of());
        given(systemSettingsService.getSettings()).willReturn(settings);

        // when
        boolean result = interceptor.preHandle(request, response, null);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("proceeds when no authentication is present in security context")
    void intercept_noAuthentication() throws Exception {
        // given
        SystemSettings settings =
                SystemSettingsTestFixtures.systemSettingsWithVerificationRequiredPaths(List.of("/api/transactions"));
        given(systemSettingsService.getSettings()).willReturn(settings);
        given(request.getRequestURI()).willReturn("/api/transactions/list");

        // when
        boolean result = interceptor.preHandle(request, response, null);

        // then
        assertThat(result).isTrue();
    }

    private void setAuthentication(User user) {
        var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}
