package com.exence.finance.common.exception;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException() {
        super();
    }
    public InvalidTokenException(String context) {
        super(context);
    }
}
