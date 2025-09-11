package com.exence.finance.common.annotations;

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

import static com.exence.finance.common.util.ValidationConstants.EMAIL_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.EMAIL_PATTERN;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {})
@Documented
@NotBlank(message = "Email cannot be blank")
@Size(max = EMAIL_MAX_LENGTH,
        message = "Email must be at most " + EMAIL_MAX_LENGTH + " characters")
@Email(message = "Email must be valid",
        regexp = EMAIL_PATTERN)
@ValidEmailDomain // custom domain validation
public @interface ValidStrictEmail {
    String message() default "Invalid email";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}