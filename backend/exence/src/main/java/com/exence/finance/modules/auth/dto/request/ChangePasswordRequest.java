package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.PasswordMatches;
import com.exence.finance.common.annotations.ValidPassword;
import jakarta.validation.constraints.NotBlank;

@PasswordMatches(password = "newPassword", confirmPassword = "confirmNewPassword")
public record ChangePasswordRequest(
        @NotBlank(message = "{validation.old-password.not-blank}") String oldPassword,
        @ValidPassword String newPassword,
        @NotBlank(message = "{validation.confirm-password.not-blank}") String confirmNewPassword) {

    @Override
    public String toString() {
        return "ChangePasswordRequest[oldPassword=[PROTECTED], newPassword=[PROTECTED],"
                + " confirmNewPassword=[PROTECTED]]";
    }
}
