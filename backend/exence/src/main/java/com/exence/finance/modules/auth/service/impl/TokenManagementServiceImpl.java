package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.modules.auth.dto.SessionSummaryProjection;
import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.TokenRepository;
import com.exence.finance.modules.auth.service.RequestContextService;
import com.exence.finance.modules.auth.service.TokenManagementService;
import com.exence.finance.security.JwtService;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TokenManagementServiceImpl implements TokenManagementService {
    private final TokenRepository tokenRepository;
    private final JwtService jwtService;
    private final RequestContextService requestContextService;

    @Scheduled(fixedRateString = "${jwt.cleanup-interval}")
    @Transactional
    public void cleanupExpiredTokens() {
        try {
            Instant now = Instant.now();
            int deletedCount = tokenRepository.deleteExpiredOrRevokedTokens(now);

            if (deletedCount > 0) {
                log.info("Cleaned up {} expired or revoked tokens", deletedCount);
            }
        } catch (Exception e) {
            log.error("Error during token cleanup", e);
        }
    }

    @Override
    @Transactional
    public Token createAndSaveToken(User user, TokenType tokenType) {
        String sessionId = UUID.randomUUID().toString();
        return createAndSaveToken(user, tokenType, sessionId);
    }

    @Override
    @Transactional
    public Token createAndSaveToken(User user, TokenType tokenType, String sessionId) {
        String jwtToken = jwtService.generateToken(user, tokenType);
        return saveTokenToDatabase(user, jwtToken, sessionId);
    }

    @Override
    public Token getTokenByJwtId(String jwtId) {
        return tokenRepository.findByJwtId(jwtId).orElse(null);
    }

    @Override
    public String getSessionIdByToken(String token) {
        Token t = tokenRepository.findByJwtId(jwtService.extractJwtId(token)).orElse(null);
        return t != null ? t.getSessionId() : "";
    }

    @Override
    @Transactional
    public int revokeAllUserTokens(User user) {
        int revokedTokens = tokenRepository.revokeAllValidTokensByUser(user.getId());
        log.info("All tokens revoked for user: {}", user.getEmail());
        return revokedTokens;
    }

    @Override
    @Transactional
    public int revokeUserTokensByType(User user, TokenType tokenType) {
        int revokedTokens = tokenRepository.revokeAllValidTokensByUserAndType(user.getId(), tokenType);
        log.info("Tokens of type {} revoked for user: {}", tokenType, user.getEmail());
        return revokedTokens;
    }

    @Override
    @Transactional
    public int revokeUserTokensByTypes(User user, List<TokenType> tokenTypes) {
        int revokedTokens = tokenRepository.revokeAllValidTokensByUserAndTypes(user.getId(), tokenTypes);
        log.info("Tokens of types {} revoked for user: {}", tokenTypes, user.getEmail());
        return revokedTokens;
    }

    @Override
    @Transactional
    public int revokeUserTokensBySessionId(Long userId, String sessionId) {
        int revokedTokens = tokenRepository.revokeAllValidTokensByUserAndSession(userId, sessionId);
        log.info("Session revoked - UserID: {}, Session: {}, Revoked tokens: {}", userId, sessionId, revokedTokens);
        return revokedTokens;
    }

    @Override
    @Transactional
    public int revokeUserTokensByTypeAndSession(User user, TokenType tokenType, String sessionId) {
        int revokedTokens =
                tokenRepository.revokeAllValidTokensByUserAndTypeAndSession(user.getId(), tokenType, sessionId);
        log.info("Tokens of type {} revoked for user: {}, session: {}", tokenType, user.getEmail(), sessionId);
        return revokedTokens;
    }

    @Override
    @Transactional
    public int revokeUserTokensByDevice(User user, List<TokenType> types, String userAgent, String ipAddress) {
        int revokedTokens =
                tokenRepository.revokeAllValidTokensByUserAndDevice(user.getId(), types, userAgent, ipAddress);
        log.info("Previous sessions revoked for user: {} from device: {} / {}", user.getEmail(), userAgent, ipAddress);
        return revokedTokens;
    }

    @Override
    @Transactional
    public int revokeUserTokensExceptSession(Long userId, String sessionId) {
        int revokedTokens = tokenRepository.revokeAllValidTokensByUserExceptSession(userId, sessionId);
        log.info(
                "All other sessions revoked - UserID: {}, Current session: {}, Revoked tokens: {}",
                userId,
                sessionId,
                revokedTokens);
        return revokedTokens;
    }

    @Override
    @Transactional
    public List<SessionSummaryProjection> findActiveSessions(Long userId) {
        return tokenRepository.findActiveSessionsByUser(userId, Instant.now());
    }

    private Token saveTokenToDatabase(User user, String jwtToken, String sessionId) {
        String jwtId = jwtService.extractJwtId(jwtToken);
        TokenType tokenType = jwtService.extractTokenType(jwtToken);
        Instant expiresAt = jwtService.extractExpiresAt(jwtToken).toInstant();
        Instant createdAt = jwtService.extractIssuedAt(jwtToken).toInstant();

        String userAgent = requestContextService.extractUserAgent();
        String ipAddress = requestContextService.extractIpAddress();

        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .jwtId(jwtId)
                .tokenType(tokenType)
                .sessionId(sessionId)
                .revoked(false)
                .expiresAt(expiresAt)
                .createdAt(createdAt)
                .lastUsedAt(Instant.now())
                .userAgent(userAgent)
                .ipAddress(ipAddress)
                .build();

        return tokenRepository.save(token);
    }
}
