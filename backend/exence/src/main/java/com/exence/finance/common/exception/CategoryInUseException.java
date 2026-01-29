package com.exence.finance.common.exception;

public class CategoryInUseException extends RuntimeException {
    public CategoryInUseException() {
        super();
    }

    public CategoryInUseException(String message) {
        super(message);
    }
}
