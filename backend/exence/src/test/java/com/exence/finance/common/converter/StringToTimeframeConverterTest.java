package com.exence.finance.common.converter;

import static org.assertj.core.api.Assertions.assertThat;

import com.exence.finance.modules.statistics.dto.Timeframe;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class StringToTimeframeConverterTest {

    private final StringToTimeframeConverter converter = new StringToTimeframeConverter();

    @Test
    @DisplayName("converts known timeframe code")
    void convert_knownCode() {
        assertThat(converter.convert("1W")).isEqualTo(Timeframe.ONE_WEEK);
        assertThat(converter.convert("1M")).isEqualTo(Timeframe.ONE_MONTH);
        assertThat(converter.convert("3M")).isEqualTo(Timeframe.THREE_MONTHS);
        assertThat(converter.convert("6M")).isEqualTo(Timeframe.SIX_MONTHS);
        assertThat(converter.convert("1Y")).isEqualTo(Timeframe.ONE_YEAR);
        assertThat(converter.convert("YTD")).isEqualTo(Timeframe.YTD);
        assertThat(converter.convert("ALL")).isEqualTo(Timeframe.ALL_TIME);
    }

    @Test
    @DisplayName("trims whitespace before converting")
    void convert_knownCodeWithWhitespace() {
        assertThat(converter.convert("  1M  ")).isEqualTo(Timeframe.ONE_MONTH);
        assertThat(converter.convert("  1W  ")).isEqualTo(Timeframe.ONE_WEEK);
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
    @DisplayName("returns null for blank string")
    void convert_blankString() {
        assertThat(converter.convert("   ")).isNull();
    }

    @Test
    @DisplayName("falls back to YTD for unrecognized code (Timeframe.fromCode behaviour)")
    void convert_unknownCode() {
        assertThat(converter.convert("UNKNOWN")).isEqualTo(Timeframe.YTD);
    }
}
