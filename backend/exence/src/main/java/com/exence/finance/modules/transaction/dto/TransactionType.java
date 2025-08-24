package com.exence.finance.modules.transaction.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum TransactionType {
    EXPENSE("Expense"),
    INCOME("Income");

    private final String value;

    public static TransactionType fromValue(String v) {
        return Arrays.stream(TransactionType.values()).filter(x -> x.value.equals(v)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException(String.valueOf(v)));
    }
}
