package com.exence.finance.common.annotations;

import com.exence.finance.common.validators.RangeValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = RangeValidator.class)
@Documented
@Repeatable(ValidRange.List.class)
public @interface ValidRange {
    String message() default "{validation.range.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    /**
     * Field name of the range start (lower bound)
     */
    String from();

    /**
     * Field name of the range end (upper bound)
     */
    String to();

    @Target({ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
    @interface List {
        ValidRange[] value();
    }
}
