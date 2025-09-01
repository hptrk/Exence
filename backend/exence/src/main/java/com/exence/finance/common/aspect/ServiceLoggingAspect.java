package com.exence.finance.common.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
@Aspect
@Component
public class ServiceLoggingAspect {

    @Before("execution(* com.exence.finance.modules.*.service.impl.*.*(..))")
    public void logServiceMethodCall(JoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        String parameters = Arrays.stream(args)
                .map(arg -> {
                    if (arg == null) return "null";
                    return arg.toString();
                })
                .collect(Collectors.joining(", "));

        log.info("Service call: {}.{}({})", className, methodName, parameters);
    }
}
