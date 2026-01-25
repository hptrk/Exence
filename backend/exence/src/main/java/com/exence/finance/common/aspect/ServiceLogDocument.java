package com.exence.finance.common.aspect;

import java.time.Instant;
import lombok.Data;

@Data
public class ServiceLogDocument {
    private String method;
    private String elapsedTime;
    private Object[] arguments;
    private Object response;
    private Throwable exception;
    private Instant timeOfRequest;
    private Instant timeOfResponse;
    private String serviceClass;
}
