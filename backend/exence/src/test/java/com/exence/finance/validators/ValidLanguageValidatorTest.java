package com.exence.finance.validators;

import static org.assertj.core.api.Assertions.assertThat;

import com.exence.finance.common.validators.ValidLanguageValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ValidLanguageValidatorTest {

    private ValidLanguageValidator validator;

    @BeforeEach
    void setUp() {
        validator = new ValidLanguageValidator();
    }

    @Test
    @DisplayName("passes for valid ISO language code")
    void validate_validLanguage() {
        assertThat(validator.isValid("en", null)).isTrue();
        assertThat(validator.isValid("hu", null)).isTrue();
        assertThat(validator.isValid("de", null)).isTrue();
    }

    @Test
    @DisplayName("passes for uppercase valid ISO language code")
    void validate_uppercaseLanguage() {
        assertThat(validator.isValid("EN", null)).isTrue();
        assertThat(validator.isValid("HU", null)).isTrue();
    }

    @Test
    @DisplayName("fails for unknown language code")
    void validate_invalidLanguage() {
        assertThat(validator.isValid("xx", null)).isFalse();
        assertThat(validator.isValid("zz", null)).isFalse();
    }

    @Test
    @DisplayName("passes for null value")
    void validate_null() {
        assertThat(validator.isValid(null, null)).isTrue();
    }
}
