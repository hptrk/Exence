package com.exence.finance.common.exception;

public class TooManyEmailsException extends RuntimeException {
    public TooManyEmailsException(String message) {
        super(message);
    }

    public TooManyEmailsException() {
        super();
    }
}
