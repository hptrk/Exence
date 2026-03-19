package com.exence.finance.common.exception;

public class WidgetNotFoundException extends RuntimeException {
    public WidgetNotFoundException() {
        super();
    }

    public WidgetNotFoundException(String context) {
        super(context);
    }
}
