package com.exence.finance.common.annotations;

import static com.exence.finance.common.util.ValidationConstants.EMAIL_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.EMAIL_PATTERN;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {})
@Documented
@NotBlank(message = "{validation.email.not-blank}")
@Size(max = EMAIL_MAX_LENGTH, message = "{validation.email.invalid}")
@Email(message = "{validation.email.invalid}", regexp = EMAIL_PATTERN)
@ValidEmailDomain
public @interface ValidStrictEmail {
    String message() default "{validation.email.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
