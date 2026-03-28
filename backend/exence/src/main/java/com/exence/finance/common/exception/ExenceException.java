package com.exence.finance.common.exception;

import lombok.Getter;

@Getter
public class ExenceException extends RuntimeException {

    private final ErrorCode errorCode;
    private final String messageKey;
    private final Object[] args;

    public ExenceException(ErrorCode errorCode) {
        super(errorCode.getTitle());
        this.errorCode = errorCode;
        this.messageKey = null;
        this.args = null;
    }

    public ExenceException(ErrorCode errorCode, String messageKey, Object... args) {
        super(errorCode.getTitle());
        this.errorCode = errorCode;
        this.messageKey = messageKey;
        this.args = args;
    }

    public String getResolvedMessageKey() {
        if (messageKey != null) {
            return errorCode.getMessageKey() + "." + messageKey;
        }
        return errorCode.getMessageKey();
    }
}
