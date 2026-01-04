package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.config.properties.ExenceProperties;
import com.exence.finance.config.properties.JwtProperties;
import com.exence.finance.modules.auth.service.CookieService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
@Slf4j
public class CookieServiceImpl implements CookieService {
    private final JwtProperties jwtProperties;
    private final ExenceProperties exenceProperties;

    private static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    private static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

    @Override
    public ResponseCookie createAccessTokenCookie(String token) {
        Duration maxAge = jwtProperties.getAccessTokenExpiration();
        return buildCookie(ACCESS_TOKEN_COOKIE_NAME, token, maxAge);
    }

    @Override
    public ResponseCookie createRefreshTokenCookie(String token) {
        Duration maxAge = jwtProperties.getRefreshTokenExpiration();
        return buildCookie(REFRESH_TOKEN_COOKIE_NAME, token, maxAge);
    }

    @Override
    public String extractAccessTokenFromCookie(HttpServletRequest request) {
        return extractCookieValue(request, ACCESS_TOKEN_COOKIE_NAME);
    }

    @Override
    public String extractRefreshTokenFromCookie(HttpServletRequest request) {
        return extractCookieValue(request, REFRESH_TOKEN_COOKIE_NAME);
    }

    @Override
    public ResponseCookie createExpiredAccessTokenCookie() {
        return buildExpiredCookie(ACCESS_TOKEN_COOKIE_NAME);
    }

    @Override
    public ResponseCookie createExpiredRefreshTokenCookie() {
        return buildExpiredCookie(REFRESH_TOKEN_COOKIE_NAME);
    }

    private ResponseCookie buildCookie(String name, String value, Duration maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(exenceProperties.isSecureCookie())
                .path("/")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
    }

    private ResponseCookie buildExpiredCookie(String name) {
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(exenceProperties.isSecureCookie())
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
    }

    private String extractCookieValue(HttpServletRequest request, String cookieName) {
        if (request.getCookies() == null) {
            return null;
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
