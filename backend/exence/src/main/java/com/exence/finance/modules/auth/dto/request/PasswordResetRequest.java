package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.PasswordMatches;
import com.exence.finance.common.annotations.ValidPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
@PasswordMatches(password = "newPassword", confirmPassword = "confirmNewPassword")
public class PasswordResetRequest {
    @NotBlank(message = "{validation.token.not-blank}")
    private String token;

    @ValidPassword
    private String newPassword;

    @NotBlank(message = "{validation.confirm-password.not-blank}")
    private String confirmNewPassword;
}
