package com.exence.finance.validators;

import com.exence.finance.common.annotations.PasswordMatches;
import com.exence.finance.common.validators.PasswordMatchesValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.Data;
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

public class PasswordMatchesValidatorTest {
    @Data
    static class TestObject {
        private String password;
        private String confirmPassword;
    }

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext nodeBuilder;

    private PasswordMatchesValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new PasswordMatchesValidator();

        lenient().when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(builder);
        lenient().when(builder.addPropertyNode(anyString())).thenReturn(nodeBuilder);
        lenient().when(nodeBuilder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();

        PasswordMatches annotation = mock(PasswordMatches.class);
        when(annotation.password()).thenReturn("password");
        when(annotation.confirmPassword()).thenReturn("confirmPassword");
        when(annotation.message()).thenReturn("Passwords do not match");
        validator.initialize(annotation);
    }

    @Test
    void test_matchingPasswords() {
        TestObject testObj = new TestObject();
        testObj.password = "BiztiBoy123!";
        testObj.confirmPassword = "BiztiBoy123!";

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_nonMatchingPasswords() {
        TestObject testObj = new TestObject();
        testObj.password = "BiztiBoy123!";
        testObj.confirmPassword = "nemBiztiBoy123!";

        assertFalse(validator.isValid(testObj, context));
    }

    @Test
    void test_nullObject() {
        assertTrue(validator.isValid(null, context));
    }

    @Test
    void test_bothPasswordsNull() {
        TestObject testObj = new TestObject();
        testObj.password = null;
        testObj.confirmPassword = null;

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_bothPasswordsEmpty() {
        TestObject testObj = new TestObject();
        testObj.password = "";
        testObj.confirmPassword = "";

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_onePasswordNullOtherNot() {
        TestObject testObj = new TestObject();
        testObj.password = "BiztiBoy123!";
        testObj.confirmPassword = null;

        assertFalse(validator.isValid(testObj, context));
    }
}