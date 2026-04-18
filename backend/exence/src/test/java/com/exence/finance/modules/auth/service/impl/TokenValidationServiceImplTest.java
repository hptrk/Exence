package com.exence.finance.modules.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.TokenRepository;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.security.JwtService;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TokenValidationServiceImplTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenRepository tokenRepository;

    @InjectMocks
    private TokenValidationServiceImpl tokenValidationService;

    private static final String TOKEN = "jwt.token.value";
    private static final String JWT_ID = "jwt-id-123";
    private static final String EMAIL = "test@example.com";

    @Test
    @DisplayName("returns user when token is valid and matches expected type")
    void validate_validToken() {
        // given
        User user = UserTestFixtures.defaultUser();
        given(jwtService.isTokenStructureValid(TOKEN)).willReturn(true);
        given(jwtService.isTokenOfType(TOKEN, TokenType.ACCESS)).willReturn(true);
        given(jwtService.isTokenExpired(TOKEN)).willReturn(false);
        given(jwtService.extractJwtId(TOKEN)).willReturn(JWT_ID);
        given(tokenRepository.existsByJwtIdAndNotRevokedAndNotExpired(eq(JWT_ID), any(Instant.class)))
                .willReturn(true);
        given(jwtService.extractUsername(TOKEN)).willReturn(EMAIL);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(jwtService.matchesUsername(TOKEN, user.getUsername())).willReturn(true);

        // when
        User result = tokenValidationService.validateAndExtractUser(TOKEN, TokenType.ACCESS);

        // then
        assertThat(result).isEqualTo(user);
    }

    @Test
    @DisplayName("throws INVALID_TOKEN when token structure is invalid")
    void validate_invalidStructure() {
        // given
        given(jwtService.isTokenStructureValid(TOKEN)).willReturn(false);

        // when / then
        assertThatThrownBy(() -> tokenValidationService.validateAndExtractUser(TOKEN, TokenType.ACCESS))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_TOKEN);
    }

    @Test
    @DisplayName("throws INVALID_TOKEN when token is of wrong type")
    void validate_wrongType() {
        // given
        given(jwtService.isTokenStructureValid(TOKEN)).willReturn(true);
        given(jwtService.isTokenOfType(TOKEN, TokenType.ACCESS)).willReturn(false);

        // when / then
        assertThatThrownBy(() -> tokenValidationService.validateAndExtractUser(TOKEN, TokenType.ACCESS))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_TOKEN);
    }

    @Test
    @DisplayName("throws INVALID_TOKEN when token is expired")
    void validate_expired() {
        // given
        given(jwtService.isTokenStructureValid(TOKEN)).willReturn(true);
        given(jwtService.isTokenOfType(TOKEN, TokenType.ACCESS)).willReturn(true);
        given(jwtService.isTokenExpired(TOKEN)).willReturn(true);

        // when / then
        assertThatThrownBy(() -> tokenValidationService.validateAndExtractUser(TOKEN, TokenType.ACCESS))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_TOKEN);
    }

    @Test
    @DisplayName("throws INVALID_TOKEN when token is revoked in database")
    void validate_revoked() {
        // given
        given(jwtService.isTokenStructureValid(TOKEN)).willReturn(true);
        given(jwtService.isTokenOfType(TOKEN, TokenType.ACCESS)).willReturn(true);
        given(jwtService.isTokenExpired(TOKEN)).willReturn(false);
        given(jwtService.extractJwtId(TOKEN)).willReturn(JWT_ID);
        given(tokenRepository.existsByJwtIdAndNotRevokedAndNotExpired(eq(JWT_ID), any(Instant.class)))
                .willReturn(false);

        // when / then
        assertThatThrownBy(() -> tokenValidationService.validateAndExtractUser(TOKEN, TokenType.ACCESS))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_TOKEN);
    }

    @Test
    @DisplayName("returns false when token username does not match user")
    void isTokenValid_userMismatch() {
        // given
        User user = UserTestFixtures.defaultUser();
        given(jwtService.isTokenStructureValid(TOKEN)).willReturn(true);
        given(jwtService.isTokenOfType(TOKEN, TokenType.ACCESS)).willReturn(true);
        given(jwtService.isTokenExpired(TOKEN)).willReturn(false);
        given(jwtService.extractJwtId(TOKEN)).willReturn(JWT_ID);
        given(tokenRepository.existsByJwtIdAndNotRevokedAndNotExpired(eq(JWT_ID), any(Instant.class)))
                .willReturn(true);
        given(jwtService.extractUsername(TOKEN)).willReturn(EMAIL);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(jwtService.matchesUsername(TOKEN, user.getUsername())).willReturn(false);

        // when
        boolean result = tokenValidationService.isTokenValid(TOKEN, TokenType.ACCESS);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("returns false when exception is thrown during validation")
    void isTokenValid_exceptionHandled() {
        // given
        given(jwtService.isTokenStructureValid(TOKEN)).willThrow(new RuntimeException("parse error"));

        // when
        boolean result = tokenValidationService.isTokenValid(TOKEN, TokenType.ACCESS);

        // then
        assertThat(result).isFalse();
    }
}
