package com.exence.finance.modules.statistics.annotations;

import com.exence.finance.modules.statistics.validators.AtLeastOneNotEmptyValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AtLeastOneNotEmptyValidator.class)
@Documented
public @interface AtLeastOneNotEmpty {
    String message() default "At least one of statCards or charts must be provided";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
