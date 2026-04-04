package com.exence.finance.modules.auth.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.auth.controller.AuthController;
import com.exence.finance.modules.auth.dto.request.EmailVerificationRequest;
import com.exence.finance.modules.auth.dto.request.ForgotPasswordRequest;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.PasswordResetRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.service.AuthService;
import com.exence.finance.modules.auth.service.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthControllerImpl implements AuthController {
    private final AuthService authService;
    private final CookieService cookieService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthenticationResponse authResponse = authService.register(request);

        ResponseCookie accessTokenCookie =
                cookieService.createAccessTokenCookie(authResponse.tokens().accessToken());
        ResponseCookie refreshTokenCookie =
                cookieService.createRefreshTokenCookie(authResponse.tokens().refreshToken());

        return ResponseFactory.okWithCookies(authResponse, accessTokenCookie, refreshTokenCookie);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthenticationResponse authResponse = authService.login(request);

        ResponseCookie accessTokenCookie =
                cookieService.createAccessTokenCookie(authResponse.tokens().accessToken());
        ResponseCookie refreshTokenCookie =
                cookieService.createRefreshTokenCookie(authResponse.tokens().refreshToken());

        return ResponseFactory.okWithCookies(authResponse, accessTokenCookie, refreshTokenCookie);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Void> refreshToken(HttpServletRequest request) {
        String newAccessToken = authService.refreshToken(request);

        ResponseCookie accessTokenCookie = cookieService.createAccessTokenCookie(newAccessToken);

        return ResponseFactory.noContentWithCookies(accessTokenCookie);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@Valid @RequestBody EmailVerificationRequest request) {
        authService.verifyEmail(request);
        return ResponseFactory.noContent();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseFactory.noContent();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        authService.resetPassword(request);
        return ResponseFactory.noContent();
    }
}
