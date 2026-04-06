package com.exence.finance.common.annotations;

import com.exence.finance.common.validators.RecurringTransactionCreateValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = RecurringTransactionCreateValidator.class)
@Documented
public @interface ValidRecurringTransaction {
    String message() default "{validation.recurring.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
