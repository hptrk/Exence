package com.exence.finance.validators;

import com.exence.finance.common.validators.EmojiValidator;
import com.exence.finance.common.annotations.ValidEmoji;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class EmojiValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    private EmojiValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new EmojiValidator();

        // lenient stubbing to avoid unnecessary strictness in tests
        lenient().when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(builder);
        lenient().when(builder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();

        // init validator with allowEmpty = false
        ValidEmoji annotation = mock(ValidEmoji.class);
        when(annotation.allowEmpty()).thenReturn(false);
        validator.initialize(annotation);
    }

    @Test
    void test_validSingleEmoji() {
        assertTrue(validator.isValid("💩", context));
    }

    @Test
    void test_invalidMultipleEmojis() {
        assertFalse(validator.isValid("👦🏿🤡", context));
    }

    @Test
    void test_invalidTextWithEmoji() {
        assertFalse(validator.isValid("szia 🚬", context));
    }

    @Test
    void test_emptyString() {
        assertFalse(validator.isValid("", context));
    }

    @Test
    void test_nullValue() {
        assertFalse(validator.isValid(null, context));
    }

    @Test
    void test_validEmojiWithSpaces() {
        assertTrue(validator.isValid(" 🐽 ", context));
    }

    @Test
    void test_invalidWithoutEmoji() {
        assertFalse(validator.isValid("A", context));
    }

    @Test
    void test_allowEmptyTrue() {
        ValidEmoji annotation = mock(ValidEmoji.class);
        when(annotation.allowEmpty()).thenReturn(true);
        validator.initialize(annotation);

        assertTrue(validator.isValid("", context));
        assertTrue(validator.isValid(null, context));
        assertTrue(validator.isValid("   ", context));
    }

    @Test
    void test_complexEmojis() {
        // family emoji (multiple code points but one emoji)
        assertTrue(validator.isValid("👨‍👩‍👧‍👦", context));

        // skin tone modifier
        assertTrue(validator.isValid("👋🏽", context));

        // flag emoji (composed of two regional indicator symbols)
        assertTrue(validator.isValid("\uD83C\uDDEF\uD83C\uDDF5", context));
    }
}