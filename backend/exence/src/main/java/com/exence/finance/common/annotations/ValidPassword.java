package com.exence.finance.common.annotations;

import com.exence.finance.common.validators.PasswordValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static com.exence.finance.common.util.ValidationConstants.PASSWORD_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_MIN_LENGTH;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordValidator.class)
@Documented
@NotBlank(message = "Password cannot be blank")
@Size(min = PASSWORD_MIN_LENGTH,
        max = PASSWORD_MAX_LENGTH,
        message = "Password must be between " + PASSWORD_MIN_LENGTH + " and " + PASSWORD_MAX_LENGTH + " characters")
public @interface ValidPassword {
    String message() default "Password does not meet security requirements";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}