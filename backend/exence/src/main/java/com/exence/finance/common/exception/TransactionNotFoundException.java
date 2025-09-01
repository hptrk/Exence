package com.exence.finance.common.exception;

public class TransactionNotFoundException extends RuntimeException {
    public TransactionNotFoundException() {
        super();
    }
    public TransactionNotFoundException(String context) {
        super(context);
    }
}
