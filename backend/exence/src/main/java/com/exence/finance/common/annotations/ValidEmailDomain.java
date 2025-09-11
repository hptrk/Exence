package com.exence.finance.common.annotations;

import com.exence.finance.common.validators.EmailDomainValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EmailDomainValidator.class)
@Documented
public @interface ValidEmailDomain {
    String message() default "Email domain is not allowed";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}