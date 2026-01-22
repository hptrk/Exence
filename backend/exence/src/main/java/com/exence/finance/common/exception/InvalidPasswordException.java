package com.exence.finance.common.exception;

public class InvalidPasswordException extends RuntimeException {
    public InvalidPasswordException(String message) {
        super(message);
    }

    public InvalidPasswordException() {
        super();
    }
}
