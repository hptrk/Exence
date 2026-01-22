package com.exence.finance.common.exception;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException() {
        super();
    }

    public CategoryNotFoundException(String context) {
        super(context);
    }
}
