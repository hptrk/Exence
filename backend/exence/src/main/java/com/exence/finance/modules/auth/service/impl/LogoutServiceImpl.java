package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.config.properties.ExenceProperties;
import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.CookieService;
import com.exence.finance.modules.auth.service.LogoutService;
import com.exence.finance.modules.auth.service.TokenManagementService;
import com.exence.finance.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogoutServiceImpl implements LogoutHandler, LogoutService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ExenceProperties exenceProperties;
    private final TokenManagementService tokenManagementService;
    private final CookieService cookieService;

    @Override
    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        SecurityContextHolder.clearContext();

        final String jwt = cookieService.extractAccessTokenFromCookie(request);

        try {
            if (jwt != null) {
                if (exenceProperties.isLogoutFromAllDevices()) {
                    logoutFromAllDevices(jwt);
                } else {
                    logoutFromCurrentDevice(jwt);
                }
            } else {
                throw new ExenceException(ErrorCode.AUTHENTICATION_FAILED);
            }
        } finally {
            ResponseCookie clearAccessToken = cookieService.createExpiredAccessTokenCookie();
            ResponseCookie clearRefreshToken = cookieService.createExpiredRefreshTokenCookie();

            response.addHeader("Set-Cookie", clearAccessToken.toString());
            response.addHeader("Set-Cookie", clearRefreshToken.toString());
        }
    }

    private void logoutFromAllDevices(String jwt) {
        try {
            String userEmail = jwtService.extractUsername(jwt);
            String jwtId = jwtService.extractJwtId(jwt);
            if (userEmail == null || jwtId == null) {
                return;
            }

            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return;
            }

            int revokedTokens =
                    tokenManagementService.revokeUserTokensByTypes(user, List.of(TokenType.ACCESS, TokenType.REFRESH));

            log.info("Logout from all devices - User: {}, Revoked tokens: {}", userEmail, revokedTokens);
        } catch (Exception e) {
            log.warn("Error during logout from all devices: {}", e.getMessage());
        }
    }

    private void logoutFromCurrentDevice(String jwt) {
        try {
            final String userEmail = jwtService.extractUsername(jwt);
            final String jwtId = jwtService.extractJwtId(jwt);

            if (userEmail == null || jwtId == null) {
                return;
            }

            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return;
            }

            Token currentToken = tokenManagementService.getTokenByJwtId(jwtId);
            if (currentToken == null) {
                return;
            }

            String sessionId = currentToken.getSessionId();
            if (sessionId != null) {
                tokenManagementService.revokeUserTokensBySessionId(user.getId(), sessionId);
            }

        } catch (Exception e) {
            log.warn("Error during logout from current device: {}", e.getMessage());
        }
    }
}
