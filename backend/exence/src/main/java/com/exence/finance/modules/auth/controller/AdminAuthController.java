package com.exence.finance.modules.auth.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Authentication (Admin)", description = "Admin-only user registration endpoint")
public interface AdminAuthController {

    @ExenceOpenApi(
            summary = "Register a new admin user",
            description =
                    "Creates a new user account with the ADMIN role. Follows the same flow as regular registration:"
                            + " default settings and dashboard widgets are created, an email-verification message is"
                            + " sent, and access/refresh tokens are returned in HttpOnly cookies. Accessible only to"
                            + " users with the ADMIN role.",
            successStatus = 200,
            successDescription = "Admin user registered successfully with authentication tokens in cookies.",
            errors = {ErrorCode.ACCESS_DENIED, ErrorCode.EMAIL_ALREADY_IN_USE, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<AuthenticationResponse> registerAdmin(RegisterRequest request);
}
