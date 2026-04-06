package com.exence.finance.modules.transaction.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EndCondition {
    NEVER("never"),
    UNTIL_DATE("until_date"),
    AFTER_OCCURRENCES("after_occurrences");

    private final String value;
}
