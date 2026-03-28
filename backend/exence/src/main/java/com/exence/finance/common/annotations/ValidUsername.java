package com.exence.finance.common.annotations;

import static com.exence.finance.common.util.ValidationConstants.USERNAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.USERNAME_MIN_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.USERNAME_PATTERN;

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

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {})
@Documented
@NotBlank(message = "{validation.username.not-blank}")
@Size(min = USERNAME_MIN_LENGTH, max = USERNAME_MAX_LENGTH, message = "{validation.username.size}")
@Pattern(regexp = USERNAME_PATTERN, message = "{validation.username.pattern}")
public @interface ValidUsername {
    String message() default "{validation.username.not-blank}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
