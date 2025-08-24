package com.exence.finance.modules.auth.controller;

import com.exence.finance.modules.auth.dto.request.AuthenticateRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.dto.response.EmptyAuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthController {
    public AuthenticationResponse register(RegisterRequest request);

    public AuthenticationResponse authenticate(AuthenticateRequest request);

    public EmptyAuthResponse refreshToken(HttpServletRequest request, HttpServletResponse servletResponse);
}
