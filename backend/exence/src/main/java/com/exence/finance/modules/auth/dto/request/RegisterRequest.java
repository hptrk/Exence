package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.PasswordMatches;
import com.exence.finance.common.annotations.UniqueEmail;
import com.exence.finance.common.annotations.ValidPassword;
import com.exence.finance.common.annotations.ValidStrictEmail;
import com.exence.finance.common.annotations.ValidUsername;
import jakarta.validation.constraints.NotBlank;
import java.io.Serializable;
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
@ToString(
        callSuper = true,
        exclude = {"password", "confirmPassword"})
@PasswordMatches(
        password = "password",
        confirmPassword = "confirmPassword",
        message = "Password and confirmation password do not match")
public class RegisterRequest implements Serializable {

    @ValidUsername
    private String username;

    @ValidStrictEmail
    @UniqueEmail
    private String email;

    @ValidPassword
    private String password;

    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;
}
