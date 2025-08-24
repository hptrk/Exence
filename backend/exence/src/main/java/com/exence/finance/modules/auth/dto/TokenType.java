package com.exence.finance.modules.auth.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum TokenType {
    BEARER("Bearer"),
    REFRESH("Refresh"),
    RESET_PASSWORD("Reset Password"),
    EMAIL_VERIFICATION("Email Verification");

    private final String value;

    public static TokenType fromValue(String v) {
        return Arrays.stream(TokenType.values()).filter(x -> x.value.equals(v)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException(String.valueOf(v)));
    }
}
