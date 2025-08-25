package com.exence.finance.modules.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;

import static com.exence.finance.common.util.ValidationConstants.EMAIL_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_MAX_LENGTH;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class LoginRequest implements Serializable {
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email must be valid")
    @Size(max = EMAIL_MAX_LENGTH,
            message = "Email must be at most " + EMAIL_MAX_LENGTH + " characters")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(max = PASSWORD_MAX_LENGTH,
            message = "Password must be at most " + PASSWORD_MAX_LENGTH + " characters")
    private String password;
}
