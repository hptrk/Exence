package com.exence.finance.validators;

import com.exence.finance.common.validators.PasswordValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;

public class PasswordValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    private PasswordValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new PasswordValidator();

        lenient().when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(builder);
        lenient().when(builder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();
    }

    @Test
    void test_validComplexPassword() {
        assertTrue(validator.isValid("BiztiBoy123!", context));
        assertTrue(validator.isValid("komplex$naGyon99", context));
        assertTrue(validator.isValid("EroS&P@ssw0rd", context));
    }

    @Test
    void test_passwordWithoutLowercase() {
        assertFalse(validator.isValid("NAGYBETU123!", context));
    }

    @Test
    void test_passwordWithoutUppercase() {
        assertFalse(validator.isValid("kisbetu123!", context));
    }

    @Test
    void test_passwordWithoutDigit() {
        assertFalse(validator.isValid("NincsBenneSzam!", context));
    }

    @Test
    void test_passwordWithoutSpecialChar() {
        assertFalse(validator.isValid("NincsSpecialChar1221", context));
    }

    @Test
    void test_commonPassword() {
        assertFalse(validator.isValid("password", context));
        assertFalse(validator.isValid("12345678", context));
        assertFalse(validator.isValid("password123", context));
    }

    @Test
    void test_nullOrEmptyPassword() {
        assertTrue(validator.isValid(null, context));
        assertTrue(validator.isValid("", context));
        assertTrue(validator.isValid("   ", context));
    }
}