package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
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
import com.exence.finance.modules.auth.entity.Role;
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
import com.exence.finance.modules.statistics.service.WidgetService;
import com.exence.finance.modules.systemsettings.service.SystemSettingsService;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
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
    private final WidgetService widgetService;
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
    private final SystemSettingsService systemSettingsService;
    private final CookieService cookieService;
    private final UserSettingsRepository userSettingsRepository;
    private final WorkspaceMembershipService workspaceMembershipService;

    @Override
    @WriteTransactional
    public AuthenticationResponse register(RegisterRequest request) {
        return internalRegister(request, Role.USER);
    }

    @Override
    @WriteTransactional
    public AuthenticationResponse registerAdmin(RegisterRequest request) {
        return internalRegister(request, Role.ADMIN);
    }

    private AuthenticationResponse internalRegister(RegisterRequest request, Role role) {
        User user = userMapper.mapRegisterRequestToUser(request);
        user.setRole(role);
        user = userRepository.save(user);

        createUserSettings(user);
        Workspace workspace = workspaceMembershipService.createDefaultWorkspace(
                user, request.workspaceName(), request.baseCurrency());
        widgetService.createDefaultDashboardWidget(workspace);
        sendEmailVerification(user);

        return createAuthenticationResponse(user, workspace.getId());
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

        return createAuthenticationResponse(user, null);
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
        Optional<User> userOptional = userRepository.findByEmail(request.email());

        if (userOptional.isEmpty()) {
            log.debug("Forgot password requested for unregistered email: {}", request.email());
            return;
        }

        User user = userOptional.get();

        if (systemSettingsService.getSettings().isRateLimitingEnabled()
                && emailLogService.hasRecentEmail(
                        user,
                        EmailType.PASSWORD_RESET,
                        systemSettingsService.getSettings().getRateLimitingCooldownMinutes())) {
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

    @WriteTransactional
    public void sendEmailVerification(User user) {
        Token verificationToken = tokenManagementService.createAndSaveToken(user, TokenType.EMAIL_VERIFICATION);
        emailService.sendVerificationEmail(user, verificationToken.getToken());
    }

    private AuthenticationResponse createAuthenticationResponse(User user, Long workspaceId) {
        String sessionId = UUID.randomUUID().toString();
        Token accessToken = tokenManagementService.createAndSaveToken(user, TokenType.ACCESS, sessionId);
        Token refreshToken = tokenManagementService.createAndSaveToken(user, TokenType.REFRESH, sessionId);

        return new AuthenticationResponse(
                userMapper.mapToUserGetDto(user),
                new TokenPair(accessToken.getToken(), refreshToken.getToken()),
                workspaceId);
    }

    private void authenticateUser(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (BadCredentialsException e) {
            throw new ExenceException(ErrorCode.AUTHENTICATION_FAILED);
        }
    }

    private void createUserSettings(User user) {
        UserSettings settings = UserSettings.builder()
                .user(user)
                .language("en")
                .primaryTheme(Theme.DARK)
                .secondaryTheme(Theme.BLUE_DOLPHIN)
                .build();
        userSettingsRepository.save(settings);
    }
}
