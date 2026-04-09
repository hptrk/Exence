package com.exence.finance.modules.email.dto;

import static com.exence.finance.common.util.ValidationConstants.EMAIL_SUBJECT_MAX_LENGTH;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BroadcastEmailRequest(
        @NotBlank @Size(max = EMAIL_SUBJECT_MAX_LENGTH) String subject, @NotBlank String htmlContent) {}
