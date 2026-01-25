package com.exence.finance.modules.auth.dto;

import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TokenType {
    ACCESS("Access"),
    REFRESH("Refresh"),
    PASSWORD_RESET("Password Reset"),
    EMAIL_VERIFICATION("Email Verification");

    private final String value;

    public static TokenType fromValue(String v) {
        return Arrays.stream(TokenType.values())
                .filter(x -> x.value.equals(v))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(String.valueOf(v)));
    }
}
