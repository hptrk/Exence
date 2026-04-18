package com.exence.finance.common.fixtures;

import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.entity.User;
import java.time.Instant;
import java.util.UUID;

public final class TokenTestFixtures {

    private TokenTestFixtures() {}

    public static Token accessToken(User user) {
        return token(user, TokenType.ACCESS, Instant.now().plusSeconds(3600));
    }

    public static Token refreshToken(User user) {
        return token(user, TokenType.REFRESH, Instant.now().plusSeconds(86400));
    }

    public static Token emailVerificationToken(User user) {
        return token(user, TokenType.EMAIL_VERIFICATION, Instant.now().plusSeconds(3600));
    }

    public static Token passwordResetToken(User user) {
        return token(user, TokenType.PASSWORD_RESET, Instant.now().plusSeconds(3600));
    }

    public static Token expiredToken(User user) {
        return token(user, TokenType.ACCESS, Instant.now().minusSeconds(1));
    }

    public static Token revokedToken(User user) {
        Token t = token(user, TokenType.ACCESS, Instant.now().plusSeconds(3600));
        t.setRevoked(true);
        return t;
    }

    private static Token token(User user, TokenType type, Instant expiresAt) {
        return Token.builder()
                .id(1L)
                .token("jwt.token.value." + UUID.randomUUID())
                .jwtId(UUID.randomUUID().toString())
                .sessionId(UUID.randomUUID().toString())
                .tokenType(type)
                .revoked(false)
                .createdAt(Instant.now())
                .expiresAt(expiresAt)
                .user(user)
                .build();
    }
}
