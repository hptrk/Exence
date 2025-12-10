package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.exception.AuthenticationFailedException;
import com.exence.finance.common.exception.EmailAlreadyVerifiedException;
import com.exence.finance.common.exception.TooManyEmailsException;
import com.exence.finance.common.exception.UserNotFoundException;
import com.exence.finance.config.properties.EmailBusinessProperties;
import com.exence.finance.modules.auth.dto.EmailType;
import com.exence.finance.modules.auth.dto.TokenType;
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
import com.exence.finance.modules.auth.service.AuthService;
import com.exence.finance.modules.auth.service.PasswordHistoryService;
import com.exence.finance.modules.auth.service.PasswordValidationService;
import com.exence.finance.modules.email.service.EmailLogService;
import com.exence.finance.modules.email.service.EmailService;
import com.exence.finance.modules.auth.service.RequestContextService;
import com.exence.finance.modules.auth.service.TokenManagementService;
import com.exence.finance.modules.auth.service.TokenValidationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final ObjectMapper objectMapper;
    private final EmailService emailService;
    private final EmailLogService emailLogService;
    private final TokenManagementService tokenManagementService;
    private final TokenValidationService tokenValidationService;
    private final RequestContextService requestContextService;
    private final PasswordValidationService passwordValidationService;
    private final PasswordHistoryService passwordHistoryService;
    private final EmailBusinessProperties emailBusinessProperties;

    @Override
    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        User user = buildNewUser(request);
        user = userRepository.save(user);

        sendEmailVerification(user);

        return createAuthenticationResponse(user);
    }

    @Override
    @Transactional
    public AuthenticationResponse login(LoginRequest request) {
        authenticateUser(request);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(UserNotFoundException::new);

        // Revoke previous tokens from the same device to prevent multiple active sessions per device
        String userAgent = requestContextService.extractUserAgent();
        String ipAddress = requestContextService.extractIpAddress();
        tokenManagementService.revokeUserTokensByDevice(user, List.of(TokenType.ACCESS, TokenType.REFRESH), userAgent, ipAddress);

        user.setLastLoginAt(Instant.now());
        user = userRepository.save(user);

        return createAuthenticationResponse(user);
    }

    @Override
    @Transactional
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
        try {
            String refreshToken = requestContextService.extractBearerToken();

            User user = tokenValidationService.validateAndExtractUser(refreshToken, TokenType.REFRESH);
            String sessionId = tokenManagementService.getSessionIdByToken(refreshToken);

            tokenManagementService.revokeUserTokensByTypeAndSession(user, TokenType.ACCESS, sessionId);
            
            AuthenticationResponse authResponse = createAuthenticationResponse(user, sessionId, refreshToken);

            writeJsonResponse(response, authResponse);
        } catch (Exception e) {
            log.error("Error during token refresh", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"currentUser", "currentUserId"}, allEntries = true)
    public void verifyEmail(EmailVerificationRequest request) {
        User user = tokenValidationService.validateAndExtractUser(request.getToken(), TokenType.EMAIL_VERIFICATION);

        if (user.getEmailVerified()) {
            throw new EmailAlreadyVerifiedException();
        }

        user.setEmailVerified(true);
        user = userRepository.save(user);

        tokenManagementService.revokeUserTokensByType(user, TokenType.EMAIL_VERIFICATION);
        emailService.sendWelcomeEmail(user);

        log.info("Email verified for user: {}", user.getEmail());
    }
    
    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(UserNotFoundException::new);

        if (emailBusinessProperties.getRateLimiting().isEnabled() &&
                emailLogService.hasRecentEmail(user, EmailType.EMAIL_VERIFICATION, emailBusinessProperties.getRateLimiting().getCooldownMinutesBetweenSends())) {
            throw new TooManyEmailsException();
        }

        tokenManagementService.revokeUserTokensByType(user, TokenType.PASSWORD_RESET);

        Token passwordResetToken = tokenManagementService.createAndSaveToken(user, TokenType.PASSWORD_RESET);
        emailService.sendPasswordResetEmail(user, passwordResetToken.getToken());

        log.info("Password reset email sent to: {}", user.getEmail());
    }
    
    @Override
    @Transactional
    @CacheEvict(value = {"currentUser", "currentUserId"}, allEntries = true)
    public void resetPassword(PasswordResetRequest request) {
        User user = tokenValidationService.validateAndExtractUser(request.getToken(), TokenType.PASSWORD_RESET);

        passwordValidationService.validatePasswordReset(user, request.getNewPassword());

        String oldPassword = user.getPassword();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        passwordHistoryService.savePasswordToHistory(user, oldPassword);
        tokenManagementService.revokeAllUserTokens(user);

        log.info("Password reset successful for user: {}", user.getEmail());
    }

    private User buildNewUser(RegisterRequest request) {
        return User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .emailVerified(false)
                .lastLoginAt(Instant.now())
                .build();
    }

    public void sendEmailVerification(User user) {
        Token verificationToken = tokenManagementService.createAndSaveToken(user, TokenType.EMAIL_VERIFICATION);
        emailService.sendVerificationEmail(user, verificationToken.getToken());
    }

    private AuthenticationResponse createAuthenticationResponse(User user) {
        String sessionId = UUID.randomUUID().toString();
        return createAuthenticationResponse(user, sessionId);
    }

    private AuthenticationResponse createAuthenticationResponse(User user, String sessionId) {
        Token accessToken = tokenManagementService.createAndSaveToken(user, TokenType.ACCESS, sessionId);
        Token refreshToken = tokenManagementService.createAndSaveToken(user, TokenType.REFRESH, sessionId);

        return AuthenticationResponse.builder()
                .user(userMapper.mapToUserDto(user))
                .accessToken(accessToken.getToken())
                .refreshToken(refreshToken.getToken())
                .build();
    }

    private AuthenticationResponse createAuthenticationResponse(User user, String sessionId, String refreshToken) {
        Token accessToken = tokenManagementService.createAndSaveToken(user, TokenType.ACCESS, sessionId);

        return AuthenticationResponse.builder()
                .user(userMapper.mapToUserDto(user))
                .accessToken(accessToken.getToken())
                .refreshToken(refreshToken)
                .build();
    }

    private void authenticateUser(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new AuthenticationFailedException();
        }
    }

    private void writeJsonResponse(HttpServletResponse response, Object object) throws Exception {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.OK.value());
        objectMapper.writeValue(response.getOutputStream(), object);
    }

    private void writeErrorResponse(HttpServletResponse response, String message, HttpStatus status) throws Exception {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(status.value());
        objectMapper.writeValue(response.getOutputStream(), message);
    }
}
