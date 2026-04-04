package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.PasswordMatches;
import com.exence.finance.common.annotations.UniqueEmail;
import com.exence.finance.common.annotations.ValidPassword;
import com.exence.finance.common.annotations.ValidStrictEmail;
import com.exence.finance.common.annotations.ValidUsername;
import com.exence.finance.common.dto.SupportedCurrency;
import jakarta.validation.constraints.NotBlank;

@PasswordMatches(password = "password", confirmPassword = "confirmPassword")
public record RegisterRequest(
        @ValidUsername String username,
        @ValidStrictEmail @UniqueEmail String email,
        @ValidPassword String password,
        @NotBlank(message = "{validation.confirm-password.not-blank}") String confirmPassword,
        @NotBlank SupportedCurrency baseCurrency) {

    @Override
    public String toString() {
        return "RegisterRequest[username=" + username + ", email=" + email
                + ", password=[PROTECTED], confirmPassword=[PROTECTED], baseCurrency=" + baseCurrency + "]";
    }
}
