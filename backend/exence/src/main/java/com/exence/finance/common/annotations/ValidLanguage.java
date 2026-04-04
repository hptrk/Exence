package com.exence.finance.common.annotations;

import com.exence.finance.common.validators.ValidLanguageValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = ValidLanguageValidator.class)
@Target({ElementType.FIELD, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidLanguage {
    String message() default "{validation.language.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
