package com.exence.finance.modules.email.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BroadcastEmailRequest(
        @NotBlank @Size(max = 255) String subject,
        @NotBlank String htmlContent) {}
