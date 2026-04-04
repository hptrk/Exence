package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.config.properties.EmailBusinessProperties;
import com.exence.finance.modules.auth.dto.EmailType;
import com.exence.finance.modules.auth.dto.Theme;
import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.dto.request.EmailVerificationRequest;
import com.exence.finance.modules.auth.dto.request.ForgotPasswordRequest;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.PasswordResetRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.dto.response.TokenPair;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.entity.UserSettings;
import com.exence.finance.modules.auth.mapper.UserMapper;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.repository.UserSettingsRepository;
import com.exence.finance.modules.auth.service.AuthService;
import com.exence.finance.modules.auth.service.CookieService;
import com.exence.finance.modules.auth.service.PasswordHistoryService;
import com.exence.finance.modules.auth.service.PasswordValidationService;
import com.exence.finance.modules.auth.service.RequestContextService;
import com.exence.finance.modules.auth.service.TokenManagementService;
import com.exence.finance.modules.auth.service.TokenValidationService;
import com.exence.finance.modules.email.service.EmailLogService;
import com.exence.finance.modules.email.service.EmailService;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.entity.Widget;
import com.exence.finance.modules.statistics.repository.WidgetRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final WidgetRepository widgetRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final EmailService emailService;
    private final EmailLogService emailLogService;
    private final TokenManagementService tokenManagementService;
    private final TokenValidationService tokenValidationService;
    private final RequestContextService requestContextService;
    private final PasswordValidationService passwordValidationService;
    private final PasswordHistoryService passwordHistoryService;
    private final EmailBusinessProperties emailBusinessProperties;
    private final CookieService cookieService;
    private final UserSettingsRepository userSettingsRepository;

    @Override
    @WriteTransactional
    public AuthenticationResponse register(RegisterRequest request) {
        User user = buildNewUser(request);
        user = userRepository.save(user);

        createUserSettings(user, request.baseCurrency());
        createDefaultDashboardWidget(user);

        sendEmailVerification(user);

        return createAuthenticationResponse(user);
    }

    @Override
    @WriteTransactional
    public AuthenticationResponse login(LoginRequest request) {
        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new ExenceException(ErrorCode.AUTHENTICATION_FAILED));

        authenticateUser(request);

        // Revoke previous tokens from the same device to prevent multiple active sessions per device
        String userAgent = requestContextService.extractUserAgent();
        String ipAddress = requestContextService.extractIpAddress();
        tokenManagementService.revokeUserTokensByDevice(
                user, List.of(TokenType.ACCESS, TokenType.REFRESH), userAgent, ipAddress);

        user.setLastLoginAt(Instant.now());
        user = userRepository.save(user);

        return createAuthenticationResponse(user);
    }

    @Override
    @WriteTransactional
    public String refreshToken(HttpServletRequest request) {
        String refreshToken = cookieService.extractRefreshTokenFromCookie(request);

        User user = tokenValidationService.validateAndExtractUser(refreshToken, TokenType.REFRESH);
        String sessionId = tokenManagementService.getSessionIdByToken(refreshToken);

        tokenManagementService.revokeUserTokensByTypeAndSession(user, TokenType.ACCESS, sessionId);

        Token newAccessToken = tokenManagementService.createAndSaveToken(user, TokenType.ACCESS, sessionId);
        return newAccessToken.getToken();
    }

    @Override
    @WriteTransactional
    @CacheEvict(
            value = {"currentUser", "currentUserId"},
            allEntries = true)
    public void verifyEmail(EmailVerificationRequest request) {
        User user = tokenValidationService.validateAndExtractUser(request.token(), TokenType.EMAIL_VERIFICATION);

        if (user.getEmailVerified()) {
            throw new ExenceException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }

        user.setEmailVerified(true);
        user = userRepository.save(user);

        tokenManagementService.revokeUserTokensByType(user, TokenType.EMAIL_VERIFICATION);
        emailService.sendWelcomeEmail(user);

        log.info("Email verified for user: {}", user.getEmail());
    }

    @Override
    @WriteTransactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new ExenceException(ErrorCode.USER_NOT_FOUND));

        if (emailBusinessProperties.rateLimiting().enabled()
                && emailLogService.hasRecentEmail(
                        user,
                        EmailType.PASSWORD_RESET,
                        emailBusinessProperties.rateLimiting().cooldownMinutesBetweenSends())) {
            throw new ExenceException(ErrorCode.TOO_MANY_EMAILS);
        }

        tokenManagementService.revokeUserTokensByType(user, TokenType.PASSWORD_RESET);

        Token passwordResetToken = tokenManagementService.createAndSaveToken(user, TokenType.PASSWORD_RESET);
        emailService.sendPasswordResetEmail(user, passwordResetToken.getToken());

        log.info("Password reset email sent to: {}", user.getEmail());
    }

    @Override
    @WriteTransactional
    @CacheEvict(
            value = {"currentUser", "currentUserId"},
            allEntries = true)
    public void resetPassword(PasswordResetRequest request) {
        User user = tokenValidationService.validateAndExtractUser(request.token(), TokenType.PASSWORD_RESET);

        passwordValidationService.validatePasswordReset(user, request.newPassword());

        String oldPassword = user.getPassword();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        passwordHistoryService.savePasswordToHistory(user, oldPassword);
        tokenManagementService.revokeAllUserTokens(user);

        log.info("Password reset successful for user: {}", user.getEmail());
    }

    private User buildNewUser(RegisterRequest request) {
        return User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .emailVerified(false)
                .lastLoginAt(Instant.now())
                .build();
    }

    @WriteTransactional
    public void sendEmailVerification(User user) {
        Token verificationToken = tokenManagementService.createAndSaveToken(user, TokenType.EMAIL_VERIFICATION);
        emailService.sendVerificationEmail(user, verificationToken.getToken());
    }

    private AuthenticationResponse createAuthenticationResponse(User user) {
        String sessionId = UUID.randomUUID().toString();
        Token accessToken = tokenManagementService.createAndSaveToken(user, TokenType.ACCESS, sessionId);
        Token refreshToken = tokenManagementService.createAndSaveToken(user, TokenType.REFRESH, sessionId);

        return new AuthenticationResponse(
                userMapper.mapToUserDto(user), new TokenPair(accessToken.getToken(), refreshToken.getToken()));
    }

    private void authenticateUser(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (BadCredentialsException e) {
            throw new ExenceException(ErrorCode.AUTHENTICATION_FAILED);
        }
    }

    private void createDefaultDashboardWidget(User user) {
        Widget widget = Widget.builder()
                .user(user)
                .type(WidgetType.DASHBOARD_BALANCE_TREND)
                .title("Balance Trend")
                .timeframe(Timeframe.YTD)
                .displayOrder(0)
                .x(0)
                .y(0)
                .cols(0)
                .rows(0)
                .settings(Collections.emptyMap())
                .build();
        widgetRepository.save(widget);
    }

    private void createUserSettings(User user, SupportedCurrency baseCurrency) {
        UserSettings settings = UserSettings.builder()
                .user(user)
                .language("en")
                .primaryTheme(Theme.DARK)
                .secondaryTheme(Theme.BLUE_DOLPHIN)
                .baseCurrency(baseCurrency)
                .showBaseCurrency(false)
                .build();
        userSettingsRepository.save(settings);
    }
}
