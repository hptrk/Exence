package com.exence.finance.modules.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record EmailVerificationRequest(@NotBlank(message = "{validation.token.not-blank}") String token) {}
