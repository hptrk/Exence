package com.exence.finance.modules.auth.dto;

import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Theme {
    LIGHT("LIGHT"),
    DARK("DARK"),
    BLUE_DOLPHIN("BLUE_DOLPHIN");

    private final String value;

    public static Theme fromValue(String v) {
        return Arrays.stream(Theme.values())
                .filter(x -> x.value.equals(v))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(v));
    }
}
