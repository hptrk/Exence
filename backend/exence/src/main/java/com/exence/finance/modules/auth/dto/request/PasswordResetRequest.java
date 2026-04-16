package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.PasswordMatches;
import com.exence.finance.common.annotations.ValidPassword;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(
        title = "Password Reset Request DTO",
        description = "Used for resetting a user's password using a valid reset token.")
@PasswordMatches(password = "newPassword", confirmPassword = "confirmNewPassword")
public record PasswordResetRequest(
        @Schema(
                        description =
                                "The password reset token sent to the user's email address. This token verifies the user's"
                                        + " identity and allows password reset without requiring the current password.",
                        example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
                @NotBlank(message = "{validation.token.not-blank}")
                String token,
        @Schema(
                        description =
                                "The new password for the user account. Must meet strong password requirements: at least one"
                                        + " lowercase letter, one uppercase letter, one digit, and one special character"
                                        + " (!@#$%^&*()_+-=[]{}';:\"\\|,.<>/?). Minimum length is 8 characters.",
                        example = "NewPassword123!")
                @ValidPassword
                String newPassword,
        @Schema(
                        description =
                                "Confirmation of the new password. Must match the value entered in the newPassword field"
                                        + " exactly.",
                        example = "NewPassword123!")
                @NotBlank(message = "{validation.confirm-password.not-blank}")
                String confirmNewPassword) {

    @Override
    public String toString() {
        return "PasswordResetRequest[token=" + token + ", newPassword=[PROTECTED], confirmNewPassword=[PROTECTED]]";
    }
}
