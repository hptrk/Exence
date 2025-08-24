package com.exence.finance.modules.auth.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.auth.controller.AuthController;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request){
        AuthenticationResponse response = authService.register(request);
        return ResponseFactory.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody LoginRequest request){
        AuthenticationResponse response = authService.login(request);
        return ResponseFactory.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        authService.refreshToken(request, response);
        return ResponseFactory.noContent();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseFactory.noContent();
    }
}
