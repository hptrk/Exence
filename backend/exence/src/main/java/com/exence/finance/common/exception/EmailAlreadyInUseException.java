package com.exence.finance.common.exception;

public class EmailAlreadyInUseException extends RuntimeException {
    public EmailAlreadyInUseException() {
        super();
    }

    public EmailAlreadyInUseException(String context) {
        super(context);
    }
}
