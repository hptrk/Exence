package com.exence.finance.modules.statistics.annotations;

import com.exence.finance.modules.statistics.validators.WidgetLayoutValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = WidgetLayoutValidator.class)
@Documented
public @interface ValidWidgetLayout {
    String message() default
            "Invalid widget layout: StatCard requires displayOrder only, graph widgets require position and size"
                    + " fields";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
