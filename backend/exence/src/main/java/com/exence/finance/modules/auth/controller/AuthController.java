package com.exence.finance.modules.auth.controller;

import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface AuthController {
    public ResponseEntity<AuthenticationResponse> register(RegisterRequest request);

    public ResponseEntity<AuthenticationResponse> login(LoginRequest request);

    public ResponseEntity<Void> refreshToken(HttpServletRequest request, HttpServletResponse servletResponse);

    public ResponseEntity<Void> logout(HttpServletRequest request);
}
