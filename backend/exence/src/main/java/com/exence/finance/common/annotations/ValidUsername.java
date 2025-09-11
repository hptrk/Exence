package com.exence.finance.common.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static com.exence.finance.common.util.ValidationConstants.USERNAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.USERNAME_MIN_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.USERNAME_PATTERN;
import static com.exence.finance.common.util.ValidationConstants.USERNAME_PATTERN_MESSAGE;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {})
@Documented
@NotBlank(message = "Username cannot be blank")
@Size(min = USERNAME_MIN_LENGTH,
        max = USERNAME_MAX_LENGTH,
        message = "Username must be between " + USERNAME_MIN_LENGTH + " and " + USERNAME_MAX_LENGTH + " characters")
@Pattern(regexp = USERNAME_PATTERN,
        message = USERNAME_PATTERN_MESSAGE)
public @interface ValidUsername {
    String message() default "Invalid username";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}