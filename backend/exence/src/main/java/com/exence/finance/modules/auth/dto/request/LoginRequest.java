package com.exence.finance.modules.auth.dto.request;

import static com.exence.finance.common.util.ValidationConstants.EMAIL_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_MAX_LENGTH;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "{validation.email.not-blank}")
                @Email(message = "{validation.email.invalid}")
                @Size(max = EMAIL_MAX_LENGTH, message = "{validation.email.size}")
                String email,
        @NotBlank(message = "{validation.password.not-blank}")
                @Size(max = PASSWORD_MAX_LENGTH, message = "{validation.password.size}")
                String password) {

    @Override
    public String toString() {
        return "LoginRequest[email=" + email + ", password=[PROTECTED]]";
    }
}
