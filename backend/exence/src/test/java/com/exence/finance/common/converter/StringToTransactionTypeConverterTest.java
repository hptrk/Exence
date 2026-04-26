package com.exence.finance.common.converter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.exence.finance.modules.transaction.dto.TransactionType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class StringToTransactionTypeConverterTest {

    private final StringToTransactionTypeConverter converter = new StringToTransactionTypeConverter();

    @Test
    @DisplayName("converts uppercase enum name to TransactionType")
    void convert_uppercaseName() {
        assertThat(converter.convert("EXPENSE")).isEqualTo(TransactionType.EXPENSE);
        assertThat(converter.convert("INCOME")).isEqualTo(TransactionType.INCOME);
    }

    @Test
    @DisplayName("converts lowercase enum value via fromValue fallback")
    void convert_lowercaseValue() {
        assertThat(converter.convert("expense")).isEqualTo(TransactionType.EXPENSE);
        assertThat(converter.convert("income")).isEqualTo(TransactionType.INCOME);
    }

    @Test
    @DisplayName("converts mixed-case string by uppercasing before valueOf")
    void convert_mixedCase() {
        assertThat(converter.convert("Expense")).isEqualTo(TransactionType.EXPENSE);
        assertThat(converter.convert("Income")).isEqualTo(TransactionType.INCOME);
    }

    @Test
    @DisplayName("returns null for null input")
    void convert_null() {
        assertThat(converter.convert(null)).isNull();
    }

    @Test
    @DisplayName("returns null for empty string")
    void convert_emptyString() {
        assertThat(converter.convert("")).isNull();
    }

    @Test
    @DisplayName("throws IllegalArgumentException for unrecognized value")
    void convert_invalidValue() {
        assertThatThrownBy(() -> converter.convert("INVALID_TYPE")).isInstanceOf(IllegalArgumentException.class);
    }
}
