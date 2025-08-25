package com.exence.finance.common.annotations;

import com.exence.finance.common.validators.AmountRangeValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AmountRangeValidator.class)
@Documented
public @interface ValidAmountRange {
    String message() default "Amount range is invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    /**
     * Field name of the minimum amount
     */
    String from();

    /**
     * Field name of the maximum amount
     */
    String to();
}