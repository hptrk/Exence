package com.exence.finance.common.annotations;

import com.exence.finance.common.validators.ValidCurrencyValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = ValidCurrencyValidator.class)
@Target({ElementType.FIELD, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidCurrency {
    String message() default "Invalid currency code. Must be a valid ISO 4217 code (e.g., HUF, EUR)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
