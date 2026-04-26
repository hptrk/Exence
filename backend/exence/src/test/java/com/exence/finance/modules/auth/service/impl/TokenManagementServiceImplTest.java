package com.exence.finance.modules.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.TokenRepository;
import com.exence.finance.modules.auth.service.RequestContextService;
import com.exence.finance.security.JwtService;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TokenManagementServiceImplTest {

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private RequestContextService requestContextService;

    @InjectMocks
    private TokenManagementServiceImpl service;

    @Test
    @DisplayName("create and save token valid")
    void createAndSaveToken_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        given(jwtService.generateToken(any(), any())).willReturn("jwt.token.value");
        given(jwtService.extractJwtId(anyString())).willReturn("jwt-id-123");
        given(jwtService.extractTokenType(anyString())).willReturn(TokenType.ACCESS);
        given(jwtService.extractExpiresAt(anyString()))
                .willReturn(Date.from(Instant.now().plusSeconds(3600)));
        given(jwtService.extractIssuedAt(anyString())).willReturn(Date.from(Instant.now()));
        given(requestContextService.extractUserAgent()).willReturn("Chrome");
        given(requestContextService.extractIpAddress()).willReturn("127.0.0.1");
        Token savedToken = Token.builder().jwtId("jwt-id-123").build();
        given(tokenRepository.save(any(Token.class))).willReturn(savedToken);

        // when
        Token result = service.createAndSaveToken(user, TokenType.ACCESS);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getJwtId()).isEqualTo("jwt-id-123");
        then(tokenRepository).should().save(any(Token.class));
    }

    @Test
    @DisplayName("get token by jwt id valid")
    void getTokenByJwtId_valid() {
        // given
        Token token = Token.builder().jwtId("abc-123").build();
        given(tokenRepository.findByJwtId("abc-123")).willReturn(Optional.of(token));

        // when
        Token result = service.getTokenByJwtId("abc-123");

        // then
        assertThat(result).isNotNull();
        assertThat(result.getJwtId()).isEqualTo("abc-123");
    }

    @Test
    @DisplayName("get token by jwt id unknown")
    void getTokenByJwtId_unknownId() {
        // given
        given(tokenRepository.findByJwtId("unknown")).willReturn(Optional.empty());

        // when
        Token result = service.getTokenByJwtId("unknown");

        // then
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("revoke all user tokens")
    void revokeAllUserTokens_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        given(tokenRepository.revokeAllValidTokensByUser(user.getId())).willReturn(3);

        // when
        int count = service.revokeAllUserTokens(user);

        // then
        assertThat(count).isEqualTo(3);
    }

    @Test
    @DisplayName("revoke user tokens by types")
    void revokeUserTokensByTypes_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        given(tokenRepository.revokeAllValidTokensByUserAndTypes(
                        user.getId(), List.of(TokenType.ACCESS, TokenType.REFRESH)))
                .willReturn(2);

        // when
        int count = service.revokeUserTokensByTypes(user, List.of(TokenType.ACCESS, TokenType.REFRESH));

        // then
        assertThat(count).isEqualTo(2);
    }

    @Test
    @DisplayName("revoke user tokens by session id")
    void revokeUserTokensBySessionId_valid() {
        // given
        given(tokenRepository.revokeAllValidTokensByUserAndSession(1L, "session-id"))
                .willReturn(1);

        // when
        int count = service.revokeUserTokensBySessionId(1L, "session-id");

        // then
        assertThat(count).isEqualTo(1);
    }

    @Test
    @DisplayName("revoke user tokens except session")
    void revokeUserTokensExceptSession_valid() {
        // given
        given(tokenRepository.revokeAllValidTokensByUserExceptSession(1L, "current-session"))
                .willReturn(2);

        // when
        int count = service.revokeUserTokensExceptSession(1L, "current-session");

        // then
        assertThat(count).isEqualTo(2);
    }

    @Test
    @DisplayName("find active sessions")
    void findActiveSessions_valid() {
        // given
        given(tokenRepository.findActiveSessionsByUser(any(), any())).willReturn(List.of());

        // when
        var result = service.findActiveSessions(1L);

        // then
        assertThat(result).isEmpty();
    }
}
