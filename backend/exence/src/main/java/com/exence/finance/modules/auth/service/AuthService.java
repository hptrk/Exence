package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.dto.request.EmailVerificationRequest;
import com.exence.finance.modules.auth.dto.request.ForgotPasswordRequest;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.PasswordResetRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.entity.User;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {

    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse login(LoginRequest request);

    String refreshToken(HttpServletRequest request);

    void verifyEmail(EmailVerificationRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(PasswordResetRequest request);

    AuthenticationResponse registerAdmin(RegisterRequest request);

    void sendEmailVerification(User user);
}
