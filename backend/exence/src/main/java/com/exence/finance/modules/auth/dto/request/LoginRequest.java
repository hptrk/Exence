package com.exence.finance.modules.auth.dto.request;

import static com.exence.finance.common.util.ValidationConstants.EMAIL_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_MAX_LENGTH;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
        exclude = {"password"})
public class LoginRequest implements Serializable {
    @NotBlank(message = "{validation.email.not-blank}")
    @Email(message = "{validation.email.invalid}")
    @Size(max = EMAIL_MAX_LENGTH, message = "{validation.email.size}")
    private String email;

    @NotBlank(message = "{validation.password.not-blank}")
    @Size(max = PASSWORD_MAX_LENGTH, message = "{validation.password.size}")
    private String password;
}
