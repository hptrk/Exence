package com.exence.finance.validators;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.exence.finance.common.annotations.ValidColor;
import com.exence.finance.common.validators.ValidColorValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class ValidColorValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    private ValidColorValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new ValidColorValidator();

        lenient()
                .when(context.buildConstraintViolationWithTemplate(anyString()))
                .thenReturn(builder);
        lenient().when(builder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();

        ValidColor annotation = mock(ValidColor.class);
        when(annotation.allowNull()).thenReturn(false);
        validator.initialize(annotation);
    }

    @Test
    void testValidHexColors() {
        assertTrue(validator.isValid("#FF5733", context));
        assertTrue(validator.isValid("#000000", context));
        assertTrue(validator.isValid("#FFFFFF", context));
        assertTrue(validator.isValid("#4CAF50", context));
        assertTrue(validator.isValid("#F44336", context));
    }

    @Test
    void testValidHexColorsLowercase() {
        assertTrue(validator.isValid("#ff5733", context));
        assertTrue(validator.isValid("#abc123", context));
        assertTrue(validator.isValid("#4caf50", context));
    }

    @Test
    void testValidHexColorsMixedCase() {
        assertTrue(validator.isValid("#Ff5733", context));
        assertTrue(validator.isValid("#AbC123", context));
        assertTrue(validator.isValid("#4CaF50", context));
    }

    @Test
    void testInvalidColorNoHashSymbol() {
        assertFalse(validator.isValid("FF5733", context));
        assertFalse(validator.isValid("000000", context));
    }

    @Test
    void testInvalidColorTooShort() {
        assertFalse(validator.isValid("#FFF", context));
        assertFalse(validator.isValid("#FF573", context));
    }

    @Test
    void testInvalidColorTooLong() {
        assertFalse(validator.isValid("#FF57333", context));
        assertFalse(validator.isValid("#FF5733FF", context));
    }

    @Test
    void testInvalidColorInvalidCharacters() {
        assertFalse(validator.isValid("#GGGGGG", context));
        assertFalse(validator.isValid("#FF57ZZ", context));
        assertFalse(validator.isValid("#XYZ123", context));
        assertFalse(validator.isValid("#12345G", context));
    }

    @Test
    void testEmptyString() {
        assertFalse(validator.isValid("", context));
    }

    @Test
    void testNullValue() {
        assertFalse(validator.isValid(null, context));
    }

    @Test
    void testValidColorWithSpaces() {
        assertTrue(validator.isValid(" #FF5733 ", context));
        assertTrue(validator.isValid("  #4CAF50  ", context));
    }

    @Test
    void testWhitespaceOnly() {
        assertFalse(validator.isValid("   ", context));
    }

    @Test
    void testAllowNullTrue() {
        ValidColor annotation = mock(ValidColor.class);
        when(annotation.allowNull()).thenReturn(true);
        validator.initialize(annotation);

        assertTrue(validator.isValid(null, context));
    }

    @Test
    void testAllowNullFalse() {
        ValidColor annotation = mock(ValidColor.class);
        when(annotation.allowNull()).thenReturn(false);
        validator.initialize(annotation);

        assertFalse(validator.isValid(null, context));
    }

    @Test
    void testInvalidFormats() {
        assertFalse(validator.isValid("rgb(255, 87, 51)", context));
        assertFalse(validator.isValid("red", context));
        assertFalse(validator.isValid("FF5733", context));
        assertFalse(validator.isValid("#FF5733FF", context));
    }
}
