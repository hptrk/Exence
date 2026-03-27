package com.exence.finance.modules.auth.dto.request;

import static com.exence.finance.common.util.ValidationConstants.EMAIL_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_MAX_LENGTH;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(title = "Login Request", description = "DTO for user authentication.")
public record LoginRequest(
        @Schema(
            description = "The email address associated with the user account. Must be in a valid email format.",
            example = "winston@exence.com")
        @NotBlank(message = "{validation.email.not-blank}")
                @Email(message = "{validation.email.invalid}")
                @Size(max = EMAIL_MAX_LENGTH, message = "{validation.email.size}")
                String email,

        @Schema(
            description = "The password for the user account. This is used to authenticate the user during login.",
            example = "Password123!")
        @NotBlank(message = "{validation.password.not-blank}")
                @Size(max = PASSWORD_MAX_LENGTH, message = "{validation.password.size}")
                String password) {

    @Override
    public String toString() {
        return "LoginRequest[email=" + email + ", password=[PROTECTED]]";
    }
}
