package com.exence.finance.common.exception;

public class WidgetTypeMismatchException extends RuntimeException {
    public WidgetTypeMismatchException() {
        super();
    }

    public WidgetTypeMismatchException(String context) {
        super(context);
    }
}
