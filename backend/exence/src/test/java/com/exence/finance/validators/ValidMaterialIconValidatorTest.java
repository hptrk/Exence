package com.exence.finance.validators;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.exence.finance.common.annotations.ValidMaterialIcon;
import com.exence.finance.common.validators.ValidMaterialIconValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class ValidMaterialIconValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    private ValidMaterialIconValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new ValidMaterialIconValidator();

        lenient()
                .when(context.buildConstraintViolationWithTemplate(anyString()))
                .thenReturn(builder);
        lenient().when(builder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();

        ValidMaterialIcon annotation = mock(ValidMaterialIcon.class);
        when(annotation.allowNull()).thenReturn(false);
        validator.initialize(annotation);
    }

    @Test
    void testValidMaterialIcon() {
        assertTrue(validator.isValid("LOCAL_GROCERY_STORE", context));
        assertTrue(validator.isValid("SHOPPING_CART", context));
        assertTrue(validator.isValid("RESTAURANT", context));
        assertTrue(validator.isValid("HOME", context));
        assertTrue(validator.isValid("PETS", context));
    }

    @Test
    void testInvalidMaterialIcon() {
        assertFalse(validator.isValid("INVALID_ICON", context));
        assertFalse(validator.isValid("shopping_cart", context)); // lowercase
        assertFalse(validator.isValid("random_text", context));
        assertFalse(validator.isValid("123", context));
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
    void testValidIconWithSpaces() {
        assertTrue(validator.isValid(" SHOPPING_CART ", context));
        assertTrue(validator.isValid("  HOME  ", context));
    }

    @Test
    void testWhitespaceOnly() {
        assertFalse(validator.isValid("   ", context));
    }

    @Test
    void testAllowNullTrue() {
        ValidMaterialIcon annotation = mock(ValidMaterialIcon.class);
        when(annotation.allowNull()).thenReturn(true);
        validator.initialize(annotation);

        assertTrue(validator.isValid(null, context));
    }

    @Test
    void testAllowNullFalse() {
        ValidMaterialIcon annotation = mock(ValidMaterialIcon.class);
        when(annotation.allowNull()).thenReturn(false);
        validator.initialize(annotation);

        assertFalse(validator.isValid(null, context));
    }
}
