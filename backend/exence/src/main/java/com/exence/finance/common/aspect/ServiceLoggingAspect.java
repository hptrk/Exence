package com.exence.finance.common.aspect;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;

@Slf4j
@Aspect
@Component
public class ServiceLoggingAspect {
    private final ObjectMapper jacksonObjectMapper;

    public ServiceLoggingAspect(ObjectMapper jacksonObjectMapper) {
        this.jacksonObjectMapper = jacksonObjectMapper;
    }

    @Around(value = "within(*..*ServiceImpl)")
    public Object logServiceMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        ServiceLogDocument doc = new ServiceLogDocument();
        doc.setTimeOfRequest(Instant.now());
        doc.setServiceClass(joinPoint.getSignature().getDeclaringTypeName());
        doc.setMethod(joinPoint.getSignature().getName());

        Object[] maskedArgs = Arrays.stream(joinPoint.getArgs())
                .map(arg -> arg == null ? "null" : arg.toString())
                .toArray();
        doc.setArguments(maskedArgs);

        Object response = null;
        try {
            response = joinPoint.proceed();
            doc.setResponse(response == null ? "null" : response.toString());
        } catch (Throwable e) {
            doc.setException(e);
            throw e;
        } finally {
            doc.setTimeOfResponse(Instant.now());
            Long elapsedTime = Duration.between(doc.getTimeOfRequest(), doc.getTimeOfResponse()).toMillis();
            doc.setElapsedTime(elapsedTime.toString());
            handleLog(doc);
        }
        return response;
    }

    public void handleLog(ServiceLogDocument document) {
        try {
            Throwable exception = document.getException();
            try {
                document.setException(null);
                int documentLength = jacksonObjectMapper.writeValueAsString(document).length();
                if (documentLength > 1000000) {
                    documentLength = 1000000;
                }
                if (exception != null) {
                    log.debug(jacksonObjectMapper.writeValueAsString(document).substring(0, documentLength), exception);
                } else {
                    log.debug(jacksonObjectMapper.writeValueAsString(document).substring(0, documentLength));
                }
            } finally {
                document.setException(exception);
            }
        } catch (JsonProcessingException e) {
            log.debug(String.valueOf(document), e);
        }
    }
}
