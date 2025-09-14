package com.exence.finance.common.aspect;

import lombok.Data;

import java.time.Instant;

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
