package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.PasswordMatches;
import com.exence.finance.common.annotations.ValidPassword;
import jakarta.validation.constraints.NotBlank;

@PasswordMatches(password = "newPassword", confirmPassword = "confirmNewPassword")
public record PasswordResetRequest(
        @NotBlank(message = "{validation.token.not-blank}") String token,
        @ValidPassword String newPassword,
        @NotBlank(message = "{validation.confirm-password.not-blank}") String confirmNewPassword) {

    @Override
    public String toString() {
        return "PasswordResetRequest[token=" + token + ", newPassword=[PROTECTED], confirmNewPassword=[PROTECTED]]";
    }
}
