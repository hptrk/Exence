package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.PasswordMatches;
import com.exence.finance.common.annotations.UniqueEmail;
import com.exence.finance.common.annotations.ValidPassword;
import com.exence.finance.common.annotations.ValidStrictEmail;
import com.exence.finance.common.annotations.ValidUsername;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.util.ValidationConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@PasswordMatches(password = "password", confirmPassword = "confirmPassword")
public record RegisterRequest(
        @ValidUsername String username,
        @ValidStrictEmail @UniqueEmail String email,
        @ValidPassword String password,
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
