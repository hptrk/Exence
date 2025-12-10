package com.exence.finance.common.exception;

public class EmailAlreadyVerifiedException extends RuntimeException {
    public EmailAlreadyVerifiedException(String message) {
        super(message);
    }
    public EmailAlreadyVerifiedException() {
        super();
    }
}
