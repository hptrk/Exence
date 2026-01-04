package com.exence.finance.modules.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseCookie;

public interface CookieService {
    ResponseCookie createAccessTokenCookie(String token);

    ResponseCookie createRefreshTokenCookie(String token);

    String extractAccessTokenFromCookie(HttpServletRequest request);

    String extractRefreshTokenFromCookie(HttpServletRequest request);

    ResponseCookie createExpiredAccessTokenCookie();

    ResponseCookie createExpiredRefreshTokenCookie();
}
