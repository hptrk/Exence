package com.exence.finance.modules.category.dto;

import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CategoryType {
    EXPENSE("expense"),
    INCOME("income"),
    MIXED("mixed");

    private final String value;

    public static com.exence.finance.modules.category.dto.CategoryType fromValue(String v) {
        return Arrays.stream(com.exence.finance.modules.category.dto.CategoryType.values())
                .filter(x -> x.value.equals(v))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(v));
    }
}
