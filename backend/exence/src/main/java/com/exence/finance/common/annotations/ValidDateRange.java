package com.exence.finance.common.annotations;

import com.exence.finance.common.validators.DateRangeValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateRangeValidator.class)
@Documented
public @interface ValidDateRange {
    String message() default "Date range is invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    /**
     * Field name of the start date
     */
    String from();

    /**
     * Field name of the end date
     */
    String to();
}