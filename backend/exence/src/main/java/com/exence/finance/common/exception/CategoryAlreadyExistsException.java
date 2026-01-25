package com.exence.finance.common.exception;

public class CategoryAlreadyExistsException extends RuntimeException {
    public CategoryAlreadyExistsException() {
        super();
    }

    public CategoryAlreadyExistsException(String context) {
        super(context);
    }
}
