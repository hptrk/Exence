package com.exence.finance.modules.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(title = "Email Verification Request DTO", description = "Used for email address verification.")
public record EmailVerificationRequest(
    @Schema(
        description =
            "The email verification token sent to the user's email address. This token is used to verify the"
                + " user's email ownership and complete the account registration process.",
        example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    @NotBlank(message = "{validation.token.not-blank}")
    String token) {}
