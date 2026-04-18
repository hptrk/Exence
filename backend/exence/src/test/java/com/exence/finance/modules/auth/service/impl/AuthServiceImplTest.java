package com.exence.finance.modules.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.never;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.SystemSettingsTestFixtures;
import com.exence.finance.common.fixtures.TokenTestFixtures;
import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.common.fixtures.WorkspaceTestFixtures;
import com.exence.finance.modules.auth.dto.EmailType;
import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.exence.finance.modules.auth.dto.request.EmailVerificationRequest;
import com.exence.finance.modules.auth.dto.request.ForgotPasswordRequest;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.PasswordResetRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.mapper.UserMapper;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.repository.UserSettingsRepository;
import com.exence.finance.modules.auth.service.CookieService;
import com.exence.finance.modules.auth.service.PasswordHistoryService;
import com.exence.finance.modules.auth.service.PasswordValidationService;
import com.exence.finance.modules.auth.service.RequestContextService;
import com.exence.finance.modules.auth.service.TokenManagementService;
import com.exence.finance.modules.auth.service.TokenValidationService;
import com.exence.finance.modules.email.service.EmailLogService;
import com.exence.finance.modules.email.service.EmailService;
import com.exence.finance.modules.statistics.service.WidgetService;
import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import com.exence.finance.modules.systemsettings.service.SystemSettingsService;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private WidgetService widgetService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserMapper userMapper;

    @Mock
    private EmailService emailService;

    @Mock
    private EmailLogService emailLogService;

    @Mock
    private TokenManagementService tokenManagementService;

    @Mock
    private TokenValidationService tokenValidationService;

    @Mock
    private RequestContextService requestContextService;

    @Mock
    private PasswordValidationService passwordValidationService;

    @Mock
    private PasswordHistoryService passwordHistoryService;

    @Mock
    private SystemSettingsService systemSettingsService;

    @Mock
    private CookieService cookieService;

    @Mock
    private UserSettingsRepository userSettingsRepository;

    @Mock
    private WorkspaceMembershipService workspaceMembershipService;

    @InjectMocks
    private AuthServiceImpl authService;

    private static final String EMAIL = "test@example.com";
    private static final String PASSWORD = "Password123!";
    private static final String TOKEN_VALUE = "jwt.token.value";

    @Test
    @DisplayName("creates user, workspace, and sends verification email")
    void register_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        Workspace workspace = WorkspaceTestFixtures.defaultWorkspace();
        RegisterRequest request = new RegisterRequest("testuser", EMAIL, PASSWORD, PASSWORD, null, "My Workspace");
        Token verificationToken = TokenTestFixtures.emailVerificationToken(user);
        UserGetDTO userGetDTO = new UserGetDTO(1L, "testuser", EMAIL, false, user.getRole());

        given(userMapper.mapRegisterRequestToUser(request)).willReturn(user);
        given(userRepository.save(user)).willReturn(user);
        given(userSettingsRepository.save(any())).willReturn(null);
        given(workspaceMembershipService.createDefaultWorkspace(eq(user), anyString(), any()))
                .willReturn(workspace);
        given(tokenManagementService.createAndSaveToken(eq(user), eq(TokenType.EMAIL_VERIFICATION)))
                .willReturn(verificationToken);
        given(tokenManagementService.createAndSaveToken(eq(user), eq(TokenType.ACCESS), anyString()))
                .willReturn(TokenTestFixtures.accessToken(user));
        given(tokenManagementService.createAndSaveToken(eq(user), eq(TokenType.REFRESH), anyString()))
                .willReturn(TokenTestFixtures.refreshToken(user));
        given(userMapper.mapToUserGetDto(user)).willReturn(userGetDTO);

        // when
        AuthenticationResponse result = authService.register(request);

        // then
        assertThat(result).isNotNull();
        assertThat(result.workspaceId()).isEqualTo(workspace.getId());
        then(workspaceMembershipService).should().createDefaultWorkspace(eq(user), anyString(), any());
        then(widgetService).should().createDefaultDashboardWidget(workspace);
        then(emailService).should().sendVerificationEmail(eq(user), anyString());
    }

    @Test
    @DisplayName("revokes old device tokens and updates last login")
    void login_validCredentials() {
        // given
        User user = UserTestFixtures.defaultUser();
        LoginRequest request = new LoginRequest(EMAIL, PASSWORD);
        Token accessToken = TokenTestFixtures.accessToken(user);
        Token refreshToken = TokenTestFixtures.refreshToken(user);
        UserGetDTO userGetDTO = new UserGetDTO(1L, "testuser", EMAIL, true, user.getRole());

        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(requestContextService.extractUserAgent()).willReturn("Mozilla/5.0");
        given(requestContextService.extractIpAddress()).willReturn("127.0.0.1");
        given(userRepository.save(user)).willReturn(user);
        given(tokenManagementService.createAndSaveToken(eq(user), eq(TokenType.ACCESS), anyString()))
                .willReturn(accessToken);
        given(tokenManagementService.createAndSaveToken(eq(user), eq(TokenType.REFRESH), anyString()))
                .willReturn(refreshToken);
        given(userMapper.mapToUserGetDto(user)).willReturn(userGetDTO);

        // when
        AuthenticationResponse result = authService.login(request);

        // then
        assertThat(result.tokens().accessToken()).isEqualTo(accessToken.getToken());
        then(tokenManagementService).should().revokeUserTokensByDevice(eq(user), anyList(), anyString(), anyString());
        then(userRepository).should().save(user);
    }

    @Test
    @DisplayName("throws AUTHENTICATION_FAILED when email not found")
    void login_unknownEmail() {
        // given
        LoginRequest request = new LoginRequest("nobody@example.com", PASSWORD);
        given(userRepository.findByEmail("nobody@example.com")).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.AUTHENTICATION_FAILED);
    }

    @Test
    @DisplayName("throws AUTHENTICATION_FAILED on bad credentials")
    void login_badCredentials() {
        // given
        User user = UserTestFixtures.defaultUser();
        LoginRequest request = new LoginRequest(EMAIL, "wrongPassword");
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(authenticationManager.authenticate(any())).willThrow(new BadCredentialsException("bad credentials"));

        // when / then
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.AUTHENTICATION_FAILED);
    }

    @Test
    @DisplayName("revokes old access token and returns new one")
    void refreshToken_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        String refreshTokenValue = TOKEN_VALUE;
        Token newAccessToken = TokenTestFixtures.accessToken(user);
        HttpServletRequest httpRequest = org.mockito.Mockito.mock(HttpServletRequest.class);

        given(cookieService.extractRefreshTokenFromCookie(httpRequest)).willReturn(refreshTokenValue);
        given(tokenValidationService.validateAndExtractUser(refreshTokenValue, TokenType.REFRESH))
                .willReturn(user);
        given(tokenManagementService.getSessionIdByToken(refreshTokenValue)).willReturn("session-id");
        given(tokenManagementService.createAndSaveToken(eq(user), eq(TokenType.ACCESS), eq("session-id")))
                .willReturn(newAccessToken);

        // when
        String result = authService.refreshToken(httpRequest);

        // then
        assertThat(result).isEqualTo(newAccessToken.getToken());
        then(tokenManagementService).should().revokeUserTokensByTypeAndSession(user, TokenType.ACCESS, "session-id");
    }

    @Test
    @DisplayName("sets verified, sends welcome email, revokes verification tokens")
    void verifyEmail_unverified() {
        // given
        User user = UserTestFixtures.unverifiedUser();
        EmailVerificationRequest request = new EmailVerificationRequest(TOKEN_VALUE);

        given(tokenValidationService.validateAndExtractUser(TOKEN_VALUE, TokenType.EMAIL_VERIFICATION))
                .willReturn(user);
        given(userRepository.save(user)).willReturn(user);

        // when
        authService.verifyEmail(request);

        // then
        assertThat(user.getEmailVerified()).isTrue();
        then(tokenManagementService).should().revokeUserTokensByType(user, TokenType.EMAIL_VERIFICATION);
        then(emailService).should().sendWelcomeEmail(user);
    }

    @Test
    @DisplayName("throws EMAIL_ALREADY_VERIFIED when user is already verified")
    void verifyEmail_alreadyVerified() {
        // given
        User user = UserTestFixtures.defaultUser();
        EmailVerificationRequest request = new EmailVerificationRequest(TOKEN_VALUE);
        given(tokenValidationService.validateAndExtractUser(TOKEN_VALUE, TokenType.EMAIL_VERIFICATION))
                .willReturn(user);

        // when / then
        assertThatThrownBy(() -> authService.verifyEmail(request))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.EMAIL_ALREADY_VERIFIED);
    }

    @Test
    @DisplayName("returns without action when email not registered")
    void forgotPassword_unknownEmail() {
        // given
        ForgotPasswordRequest request = new ForgotPasswordRequest("nobody@example.com");
        given(userRepository.findByEmail("nobody@example.com")).willReturn(Optional.empty());

        // when
        authService.forgotPassword(request);

        // then
        then(emailService).shouldHaveNoInteractions();
        then(tokenManagementService).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("throws TOO_MANY_EMAILS when rate limiting is active and recent email exists")
    void forgotPassword_rateLimited() {
        // given
        User user = UserTestFixtures.defaultUser();
        ForgotPasswordRequest request = new ForgotPasswordRequest(EMAIL);
        SystemSettings settings = SystemSettingsTestFixtures.systemSettings(true, 5);

        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(systemSettingsService.getSettings()).willReturn(settings);
        given(emailLogService.hasRecentEmail(eq(user), eq(EmailType.PASSWORD_RESET), eq(5)))
                .willReturn(true);

        // when / then
        assertThatThrownBy(() -> authService.forgotPassword(request))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TOO_MANY_EMAILS);
    }

    @Test
    @DisplayName("sends email regardless of recent activity when rate limiting is disabled")
    void forgotPassword_rateLimitDisabled() {
        // given
        User user = UserTestFixtures.defaultUser();
        ForgotPasswordRequest request = new ForgotPasswordRequest(EMAIL);
        Token resetToken = TokenTestFixtures.passwordResetToken(user);
        SystemSettings settings = SystemSettingsTestFixtures.systemSettings(false, 5);

        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(systemSettingsService.getSettings()).willReturn(settings);
        given(tokenManagementService.createAndSaveToken(user, TokenType.PASSWORD_RESET))
                .willReturn(resetToken);

        // when
        authService.forgotPassword(request);

        // then
        then(emailLogService).should(never()).hasRecentEmail(any(), any(), any(Integer.class));
        then(emailService).should().sendPasswordResetEmail(eq(user), anyString());
    }

    @Test
    @DisplayName("encodes new password, revokes all tokens, saves to history")
    void resetPassword_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        PasswordResetRequest request = new PasswordResetRequest(TOKEN_VALUE, "NewPassword123!", "NewPassword123!");
        String encodedPassword = "$argon2id$newEncodedPassword";

        given(tokenValidationService.validateAndExtractUser(TOKEN_VALUE, TokenType.PASSWORD_RESET))
                .willReturn(user);
        willDoNothing().given(passwordValidationService).validatePasswordReset(eq(user), anyString());
        given(passwordEncoder.encode("NewPassword123!")).willReturn(encodedPassword);
        given(userRepository.save(user)).willReturn(user);

        // when
        authService.resetPassword(request);

        // then
        assertThat(user.getPassword()).isEqualTo(encodedPassword);
        then(passwordHistoryService).should().savePasswordToHistory(eq(user), anyString());
        then(tokenManagementService).should().revokeAllUserTokens(user);
    }
}
