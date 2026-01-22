package com.exence.finance.common.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException() {
        super();
    }

    public UserNotFoundException(String context) {
        super(context);
    }
}
