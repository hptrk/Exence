package com.exence.finance.common.annotations;

import com.exence.finance.common.exception.ErrorCode;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ExenceOpenApi {

    String summary() default "";

    String description() default "";

    int successStatus() default 200;

    String successDescription() default "";

    ErrorCode[] errors() default {};
}
