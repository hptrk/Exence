package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.PasswordMatches;
import com.exence.finance.common.annotations.ValidPassword;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@PasswordMatches(password = "newPassword", confirmPassword = "confirmNewPassword")
@Schema(title = "Change Password Request DTO", description = "Used for changing an authenticated user's password.")
public record ChangePasswordRequest(
        @Schema(
            description =
                "The current password of the user account. Required to verify the user's identity before allowing"
                    + " password change.",
            example = "OldPassword123!")
        @NotBlank(message = "{validation.old-password.not-blank}")
        String oldPassword,

        @Schema(
            description = "The new password for the user account. Must meet strong password requirements: at least one"
                + " lowercase letter, one uppercase letter, one digit, and one special character"
                + " (!@#$%^&*()_+-=[]{}';:\"\\|,.<>/?). Minimum length is 8 characters.",
            example = "NewPassword123!")
        @ValidPassword
        String newPassword,

        @Schema(
            description =
                "Confirmation of the new password. Must match the value entered in the newPassword field exactly.",
            example = "NewPassword123!")
        @NotBlank(message = "{validation.confirm-password.not-blank}")
        String confirmNewPassword) {

    @Override
    public String toString() {
        return "ChangePasswordRequest[oldPassword=[PROTECTED], newPassword=[PROTECTED],"
                + " confirmNewPassword=[PROTECTED]]";
    }
}
