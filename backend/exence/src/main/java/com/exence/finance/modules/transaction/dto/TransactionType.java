package com.exence.finance.modules.transaction.dto;

import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TransactionType {
    EXPENSE("expense"),
    INCOME("income");

    private final String value;

    public static TransactionType fromValue(String v) {
        return Arrays.stream(TransactionType.values())
                .filter(x -> x.value.equals(v))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(v));
    }
}
