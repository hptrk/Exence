package com.exence.finance.modules.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @NotBlank(message = "{validation.email.not-blank}") @Email(message = "{validation.email.invalid}")
                String email) {}
