package com.exence.finance.validators;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.common.validators.PasswordValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class PasswordValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    @Mock
    private I18nService i18n;

    private PasswordValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new PasswordValidator(i18n);

        lenient()
                .when(context.buildConstraintViolationWithTemplate(anyString()))
                .thenReturn(builder);
        lenient().when(builder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();

        when(i18n.get(eq("validation.password.lowercase"))).thenReturn("must contain at least one lowercase letter");
        when(i18n.get(eq("validation.password.uppercase"))).thenReturn("must contain at least one uppercase letter");
        when(i18n.get(eq("validation.password.digit"))).thenReturn("must contain at least one number");
        when(i18n.get(eq("validation.password.special-char"), any()))
                .thenReturn("must contain at least one special character");
        when(i18n.get(eq("validation.password.violations"), any())).thenReturn("Password validation failed");
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
    void test_nullOrEmptyPassword() {
        assertTrue(validator.isValid(null, context));
        assertTrue(validator.isValid("", context));
        assertTrue(validator.isValid("   ", context));
    }
}
