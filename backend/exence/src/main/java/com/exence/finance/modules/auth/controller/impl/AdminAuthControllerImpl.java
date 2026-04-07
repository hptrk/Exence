package com.exence.finance.modules.auth.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.auth.controller.AdminAuthController;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.service.AuthService;
import com.exence.finance.modules.auth.service.CookieService;
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
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AdminAuthControllerImpl implements AdminAuthController {
    private final AuthService authService;
    private final CookieService cookieService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> registerAdmin(@Valid @RequestBody RegisterRequest request) {
        AuthenticationResponse authResponse = authService.registerAdmin(request);

        ResponseCookie accessTokenCookie =
                cookieService.createAccessTokenCookie(authResponse.tokens().accessToken());
        ResponseCookie refreshTokenCookie =
                cookieService.createRefreshTokenCookie(authResponse.tokens().refreshToken());

        return ResponseFactory.okWithCookies(authResponse, accessTokenCookie, refreshTokenCookie);
    }
}
