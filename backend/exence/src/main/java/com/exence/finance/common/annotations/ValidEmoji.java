package com.exence.finance.common.annotations;

import com.exence.finance.common.validators.EmojiValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = EmojiValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidEmoji {
    String message() default "Invalid emoji";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    boolean allowEmpty() default true;
}
