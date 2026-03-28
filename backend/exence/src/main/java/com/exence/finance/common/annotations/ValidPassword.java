package com.exence.finance.common.annotations;

import static com.exence.finance.common.util.ValidationConstants.PASSWORD_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_MIN_LENGTH;

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

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordValidator.class)
@Documented
@NotBlank(message = "{validation.password.not-blank}")
@Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH, message = "{validation.password.size}")
public @interface ValidPassword {
    String message() default "{validation.password.requirements}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
