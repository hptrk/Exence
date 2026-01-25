package com.exence.finance.modules.auth.controller;

import com.exence.finance.modules.auth.dto.request.EmailVerificationRequest;
import com.exence.finance.modules.auth.dto.request.ForgotPasswordRequest;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.PasswordResetRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface AuthController {

    ResponseEntity<AuthenticationResponse> register(RegisterRequest request);

    ResponseEntity<AuthenticationResponse> login(LoginRequest request);

    ResponseEntity<Void> refreshToken(HttpServletRequest request);

    ResponseEntity<Void> verifyEmail(EmailVerificationRequest request);

    ResponseEntity<Void> forgotPassword(ForgotPasswordRequest request);

    ResponseEntity<Void> resetPassword(PasswordResetRequest request);
}
