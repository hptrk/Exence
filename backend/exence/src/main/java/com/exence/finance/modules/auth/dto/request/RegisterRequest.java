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

@Schema(title = "Register Request DTO", description = "Used for user registration.")
@PasswordMatches(password = "password", confirmPassword = "confirmPassword")
public record RegisterRequest(
        @Schema(
                description =
                        "The username for the user account. Can only contain letters, numbers, underscores and spaces."
                                + " This username is used for authentication and login.",
                example = "Winston")
        @ValidUsername
        String username,

        @Schema(
                description = "The email address associated with the user account. Must be unique and in a valid email"
                        + " format. Used for password recovery, email notifications, and account verification.",
                example = "winston@exence.com")
        @ValidStrictEmail
        @UniqueEmail
        String email,

        @Schema(
                description = "The password for the user account. Strong password requirements: at least one lowercase"
                        + " letter, one uppercase letter, one digit, and one special character"
                        + " (!@#$%^&*()_+-=[]{}';:\"\\|,.<>/?). Minimum length is 8 characters.",
                example = "Password123!")
        @ValidPassword
        String password,

        @Schema(
                description =
                        "Confirmation of the password. Must match the 'password' field exactly to ensure the user has"
                                + " entered their desired password correctly.",
                example = "Password123!")
        @NotBlank(message = "{validation.confirm-password.not-blank}")
        String confirmPassword,

        @Schema(
                description = "The user's preferred base currency for financial data display. Supported values include"
                        + " standard ISO 4217 currency codes (e.g., USD, EUR, GBP).",
                example = "HUF")
        @NotNull
        SupportedCurrency baseCurrency,

        @Schema(
                description =
                        "The name of the user's default workspace. This is a required field and must not be blank. The"
                                + " workspace can be used to organize financial data and settings within the"
                                + " application.",
                example = "Winston's Workspace")
        @NotBlank
        @Size(max = ValidationConstants.WORKSPACE_NAME_MAX_LENGTH)
        String workspaceName) {

    @Override
    public String toString() {
        return "RegisterRequest[username=" + username + ", email=" + email
                + ", password=[PROTECTED], confirmPassword=[PROTECTED], baseCurrency=" + baseCurrency
                + ", workspaceName=" + workspaceName + "]";
    }
}
