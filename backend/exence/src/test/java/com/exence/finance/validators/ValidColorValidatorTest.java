package com.exence.finance.validators;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.exence.finance.common.annotations.ValidColor;
import com.exence.finance.common.validators.ValidColorValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ValidColorValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    private ValidColorValidator validator;

    @BeforeEach
    void setUp() {
        validator = new ValidColorValidator();

        ValidColor annotation = mock(ValidColor.class);
        when(annotation.allowNull()).thenReturn(false);
        validator.initialize(annotation);
    }

    private void givenViolationContextConfigured() {
        given(context.buildConstraintViolationWithTemplate(anyString())).willReturn(builder);
    }

    @Test
    @DisplayName("returns true for valid uppercase hex colors")
    void validate_validHexColors() {
        assertThat(validator.isValid("#FF5733", context)).isTrue();
        assertThat(validator.isValid("#000000", context)).isTrue();
        assertThat(validator.isValid("#FFFFFF", context)).isTrue();
        assertThat(validator.isValid("#4CAF50", context)).isTrue();
        assertThat(validator.isValid("#F44336", context)).isTrue();
    }

    @Test
    @DisplayName("returns true for valid lowercase hex colors")
    void validate_validHexColorsLowercase() {
        assertThat(validator.isValid("#ff5733", context)).isTrue();
        assertThat(validator.isValid("#abc123", context)).isTrue();
        assertThat(validator.isValid("#4caf50", context)).isTrue();
    }

    @Test
    @DisplayName("returns true for valid mixed-case hex colors")
    void validate_validHexColorsMixedCase() {
        assertThat(validator.isValid("#Ff5733", context)).isTrue();
        assertThat(validator.isValid("#AbC123", context)).isTrue();
        assertThat(validator.isValid("#4CaF50", context)).isTrue();
    }

    @Test
    @DisplayName("returns false when color has no hash prefix")
    void validate_invalidColorNoHashSymbol() {
        givenViolationContextConfigured();

        assertThat(validator.isValid("FF5733", context)).isFalse();
        assertThat(validator.isValid("000000", context)).isFalse();
    }

    @Test
    @DisplayName("returns false when color is too short")
    void validate_invalidColorTooShort() {
        givenViolationContextConfigured();

        assertThat(validator.isValid("#FFF", context)).isFalse();
        assertThat(validator.isValid("#FF573", context)).isFalse();
    }

    @Test
    @DisplayName("returns false when color is too long")
    void validate_invalidColorTooLong() {
        givenViolationContextConfigured();

        assertThat(validator.isValid("#FF57333", context)).isFalse();
        assertThat(validator.isValid("#FF5733FF", context)).isFalse();
    }

    @Test
    @DisplayName("returns false when color contains non-hex characters")
    void validate_invalidColorInvalidCharacters() {
        givenViolationContextConfigured();

        assertThat(validator.isValid("#GGGGGG", context)).isFalse();
        assertThat(validator.isValid("#FF57ZZ", context)).isFalse();
        assertThat(validator.isValid("#XYZ123", context)).isFalse();
        assertThat(validator.isValid("#12345G", context)).isFalse();
    }

    @Test
    @DisplayName("returns false for empty string")
    void validate_emptyString() {
        givenViolationContextConfigured();

        assertThat(validator.isValid("", context)).isFalse();
    }

    @Test
    @DisplayName("returns false for null when allowNull is false")
    void validate_nullValue() {
        assertThat(validator.isValid(null, context)).isFalse();
    }

    @Test
    @DisplayName("returns true when valid color contains surrounding spaces")
    void validate_validColorWithSpaces() {
        assertThat(validator.isValid(" #FF5733 ", context)).isTrue();
        assertThat(validator.isValid("  #4CAF50  ", context)).isTrue();
    }

    @Test
    @DisplayName("returns false for whitespace-only value")
    void validate_whitespaceOnly() {
        givenViolationContextConfigured();

        assertThat(validator.isValid("   ", context)).isFalse();
    }

    @Test
    @DisplayName("returns true for null when allowNull is true")
    void validate_allowNullTrue() {
        ValidColor annotation = mock(ValidColor.class);
        when(annotation.allowNull()).thenReturn(true);
        validator.initialize(annotation);

        assertThat(validator.isValid(null, context)).isTrue();
    }

    @Test
    @DisplayName("returns false for null when allowNull is false")
    void validate_allowNullFalse() {
        ValidColor annotation = mock(ValidColor.class);
        when(annotation.allowNull()).thenReturn(false);
        validator.initialize(annotation);

        assertThat(validator.isValid(null, context)).isFalse();
    }

    @Test
    @DisplayName("returns false for unsupported color formats")
    void validate_invalidFormats() {
        givenViolationContextConfigured();

        assertThat(validator.isValid("rgb(255, 87, 51)", context)).isFalse();
        assertThat(validator.isValid("red", context)).isFalse();
        assertThat(validator.isValid("FF5733", context)).isFalse();
        assertThat(validator.isValid("#FF5733FF", context)).isFalse();
    }
}
