package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.dto.SessionSummaryProjection;
import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.entity.User;

import java.util.List;

public interface TokenManagementService {

    /**
     * Removes expired tokens from the database.
     * The cleanup interval is configured in the application properties.
     */
    void cleanupExpiredTokens();

    Token createAndSaveToken(User user, TokenType tokenType);

    Token createAndSaveToken(User user, TokenType tokenType, String sessionId);

    Token getTokenByJwtId(String jwtId);

    String getSessionIdByToken(String token);

    int revokeAllUserTokens(User user);

    int revokeUserTokensByType(User user, TokenType tokenType);

    int revokeUserTokensByTypes(User user, List<TokenType> tokenType);

    int revokeUserTokensBySessionId(Long userId, String sessionId);

    int revokeUserTokensByTypeAndSession(User user, TokenType tokenType, String sessionId);

    int revokeUserTokensByDevice(User user, List<TokenType> tokenType, String userAgent, String ipAddress);

    List<SessionSummaryProjection> findActiveSessions(Long userId);

    int revokeUserTokensExceptSession(Long userId, String sessionId);
}