package com.exence.finance.common.converter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.exence.finance.modules.category.dto.CategoryType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class StringToCategoryTypeConverterTest {

    private final StringToCategoryTypeConverter converter = new StringToCategoryTypeConverter();

    @Test
    @DisplayName("converts uppercase enum name to CategoryType")
    void convert_uppercaseName() {
        assertThat(converter.convert("EXPENSE")).isEqualTo(CategoryType.EXPENSE);
        assertThat(converter.convert("INCOME")).isEqualTo(CategoryType.INCOME);
        assertThat(converter.convert("MIXED")).isEqualTo(CategoryType.MIXED);
    }

    @Test
    @DisplayName("converts lowercase enum value via fromValue fallback")
    void convert_lowercaseValue() {
        assertThat(converter.convert("expense")).isEqualTo(CategoryType.EXPENSE);
        assertThat(converter.convert("income")).isEqualTo(CategoryType.INCOME);
        assertThat(converter.convert("mixed")).isEqualTo(CategoryType.MIXED);
    }

    @Test
    @DisplayName("converts mixed-case string by uppercasing before valueOf")
    void convert_mixedCase() {
        assertThat(converter.convert("Income")).isEqualTo(CategoryType.INCOME);
        assertThat(converter.convert("Expense")).isEqualTo(CategoryType.EXPENSE);
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
