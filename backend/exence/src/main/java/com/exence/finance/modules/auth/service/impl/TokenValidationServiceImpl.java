package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.exception.InvalidTokenException;
import com.exence.finance.common.exception.UserNotFoundException;
import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.TokenRepository;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.TokenValidationService;
import com.exence.finance.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TokenValidationServiceImpl implements TokenValidationService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    @Override
    public User validateAndExtractUser(String token, TokenType expectedType) {
        if (!isTokenValid(token, expectedType)) {
            throw new InvalidTokenException();
        }

        String userEmail = jwtService.extractUsername(token);
        return userRepository.findByEmail(userEmail)
                .orElseThrow(UserNotFoundException::new);
    }

    @Override
    public boolean isTokenValid(String token, TokenType expectedType) {
        try {
            if (!jwtService.isTokenStructureValid(token)) {
                log.debug("Token structure is invalid");
                return false;
            }

            if (!jwtService.isTokenOfType(token, expectedType)) {
                log.debug("Token type mismatch. Expected: {}, Found: {}", expectedType, jwtService.extractTokenType(token));
                return false;
            }

            if (jwtService.isTokenExpired(token)) {
                log.debug("Token is expired");
                return false;
            }

            String jwtId = jwtService.extractJwtId(token);
            if (!isTokenActive(jwtId)) {
                log.debug("Token is not active in database");
                return false;
            }

            String userEmail = jwtService.extractUsername(token);
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                log.debug("User not found for token");
                return false;
            }

            if (!jwtService.matchesUsername(token, user.getUsername())) {
                log.debug("Token username mismatch");
                return false;
            }

            return true;
        } catch (Exception e) {
            log.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean isTokenActive(String jwtId) {
        return tokenRepository.existsByJwtIdAndNotRevokedAndNotExpired(jwtId, Instant.now());
    }

}