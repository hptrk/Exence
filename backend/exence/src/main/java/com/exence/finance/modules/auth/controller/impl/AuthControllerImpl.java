package com.exence.finance.modules.auth.controller.impl;

import com.exence.finance.modules.auth.controller.AuthController;
import com.exence.finance.modules.auth.dto.request.AuthenticateRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.dto.response.EmptyAuthResponse;
import com.exence.finance.modules.auth.service.impl.AuthServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthControllerImpl implements AuthController {
    private final AuthServiceImpl authService;

    @PostMapping("/register")
    public AuthenticationResponse register(RegisterRequest request){
        AuthenticationResponse response = authService.register(request);
        return response;
    }

    @PostMapping("/authenticate")
    public AuthenticationResponse authenticate(AuthenticateRequest request){
        AuthenticationResponse response = authService.authenticate(request);
        return response;
    }

    @PostMapping("/refreshToken")
    public EmptyAuthResponse refreshToken(HttpServletRequest request, HttpServletResponse servletResponse) {
        EmptyAuthResponse response = authService.refreshToken(request, servletResponse);
        return response;
    }
}
