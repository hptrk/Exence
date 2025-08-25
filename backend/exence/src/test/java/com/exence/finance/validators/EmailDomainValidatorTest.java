package com.exence.finance.validators;

import com.exence.finance.common.validators.EmailDomainValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;

public class EmailDomainValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    private EmailDomainValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new EmailDomainValidator();

        lenient().when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(builder);
        lenient().when(builder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();
    }

    @Test
    void test_validDomain() {
        assertTrue(validator.isValid("test@gmail.com", context));
        assertTrue(validator.isValid("user@company.com", context));
    }

    @Test
    void test_blacklistedDomain() {
        assertFalse(validator.isValid("test@10minutemail.com", context));
        assertFalse(validator.isValid("user@tempmail.org", context));
    }

    @Test
    void test_nullOrEmpty() {
        assertTrue(validator.isValid(null, context));
        assertTrue(validator.isValid("", context));
    }
}