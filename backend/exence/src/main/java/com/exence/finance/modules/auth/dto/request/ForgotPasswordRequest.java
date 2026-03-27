package com.exence.finance.modules.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(title = "Forgot Password Request", description = "DTO for initiating the password recovery process.")
public record ForgotPasswordRequest(
        @Schema(
            description =
                "The email address associated with the user account. A password reset link will be sent to this"
                    + " email address.",
            example = "winston@exence.com")
        @NotBlank(message = "{validation.email.not-blank}")
        @Email(message = "{validation.email.invalid}")
        String email) {}
