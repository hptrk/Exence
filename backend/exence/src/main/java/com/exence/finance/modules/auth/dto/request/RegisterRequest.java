package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.PasswordMatches;
import com.exence.finance.common.annotations.UniqueEmail;
import com.exence.finance.common.annotations.ValidPassword;
import com.exence.finance.common.annotations.ValidStrictEmail;
import com.exence.finance.common.annotations.ValidUsername;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.util.ValidationConstants;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Request DTO for user registration.")
@PasswordMatches(password = "password", confirmPassword = "confirmPassword")
public record RegisterRequest(
        @Schema(
            description = "The username for the user account. Can only contain letters, numbers, and underscores. This"
                + " username is used for authentication and login.",
            example = "Winston")
        @ValidUsername
        String username,

        @Schema(
            description =
                "The email address associated with the user account. Must be unique and in a valid email format."
                    + " Used for password recovery, email notifications, and account verification.",
            example = "winston@exence.com")
        @ValidStrictEmail
        @UniqueEmail
        String email,

        @Schema(
            description =
                "The password for the user account. Strong password requirements: at least one lowercase letter,"
                    + " one uppercase letter, one digit, and one special character"
                    + " (!@#$%^&*()_+-=[]{}';:\"\\|,.<>/?). Minimum length is 8 characters.",
            example = "Password123!")
        @ValidPassword
        String password,

        @NotBlank(message = "{validation.confirm-password.not-blank}") String confirmPassword,
        @NotNull SupportedCurrency baseCurrency,
        @NotBlank @Size(max = ValidationConstants.WORKSPACE_NAME_MAX_LENGTH) String workspaceName) {

    @Override
    public String toString() {
        return "RegisterRequest[username=" + username + ", email=" + email
                + ", password=[PROTECTED], confirmPassword=[PROTECTED], baseCurrency=" + baseCurrency
                + ", workspaceName=" + workspaceName + "]";
    }
}
