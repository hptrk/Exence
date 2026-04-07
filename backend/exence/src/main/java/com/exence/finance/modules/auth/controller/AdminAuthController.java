package com.exence.finance.modules.auth.controller;

import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import org.springframework.http.ResponseEntity;

public interface AdminAuthController {

    ResponseEntity<AuthenticationResponse> registerAdmin(RegisterRequest request);
}
