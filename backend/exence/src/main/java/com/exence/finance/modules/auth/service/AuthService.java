package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.dto.request.EmailVerificationRequest;
import com.exence.finance.modules.auth.dto.request.ForgotPasswordRequest;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.PasswordResetRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.category.dto.CategoryDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse login(LoginRequest request);

    void refreshToken(HttpServletRequest request, HttpServletResponse servletResponse);

    void verifyEmail(EmailVerificationRequest request);
    
    void forgotPassword(ForgotPasswordRequest request);
    
    void resetPassword(PasswordResetRequest request);

    void sendEmailVerification(User user);

}
