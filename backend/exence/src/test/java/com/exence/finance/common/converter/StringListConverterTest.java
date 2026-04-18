package com.exence.finance.common.converter;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class StringListConverterTest {

    private final StringListConverter converter = new StringListConverter();

    // --- convertToDatabaseColumn ---

    @Test
    @DisplayName("joins list to comma-delimited string")
    void convertToDatabaseColumn_normalList() {
        assertThat(converter.convertToDatabaseColumn(List.of("a", "b", "c"))).isEqualTo("a,b,c");
    }

    @Test
    @DisplayName("returns empty string for null list")
    void convertToDatabaseColumn_nullList() {
        assertThat(converter.convertToDatabaseColumn(null)).isEqualTo("");
    }

    @Test
    @DisplayName("returns empty string for empty list")
    void convertToDatabaseColumn_emptyList() {
        assertThat(converter.convertToDatabaseColumn(List.of())).isEqualTo("");
    }

    // --- convertToEntityAttribute ---

    @Test
    @DisplayName("splits comma-delimited string into list")
    void convertToEntityAttribute_csvString() {
        assertThat(converter.convertToEntityAttribute("a,b,c")).containsExactly("a", "b", "c");
    }

    @Test
    @DisplayName("returns empty list for null db data")
    void convertToEntityAttribute_nullDbData() {
        assertThat(converter.convertToEntityAttribute(null)).isEmpty();
    }

    @Test
    @DisplayName("returns empty list for blank db data")
    void convertToEntityAttribute_blankDbData() {
        assertThat(converter.convertToEntityAttribute("   ")).isEmpty();
    }

    @Test
    @DisplayName("trims whitespace around each entry")
    void convertToEntityAttribute_trimsWhitespace() {
        assertThat(converter.convertToEntityAttribute(" a , b ")).containsExactly("a", "b");
    }

    @Test
    @DisplayName("filters out blank entries produced by consecutive delimiters")
    void convertToEntityAttribute_filtersBlankEntries() {
        assertThat(converter.convertToEntityAttribute("a,,b")).containsExactly("a", "b");
    }
}
