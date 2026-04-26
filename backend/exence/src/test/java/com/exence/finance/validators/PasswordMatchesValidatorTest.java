package com.exence.finance.validators;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.exence.finance.common.annotations.PasswordMatches;
import com.exence.finance.common.validators.PasswordMatchesValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.Data;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
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
        validator = new PasswordMatchesValidator();

        PasswordMatches annotation = mock(PasswordMatches.class);
        when(annotation.password()).thenReturn("password");
        when(annotation.confirmPassword()).thenReturn("confirmPassword");
        when(annotation.message()).thenReturn("Passwords do not match");
        validator.initialize(annotation);
    }

    @Test
    @DisplayName("returns true when password and confirmation match")
    void validate_matchingPasswords() {
        // given
        TestObject testObj = new TestObject();
        testObj.password = "SecureBoy123!";
        testObj.confirmPassword = "SecureBoy123!";

        // when / then
        assertThat(validator.isValid(testObj, context)).isTrue();
    }

    @Test
    @DisplayName("returns false when password and confirmation differ")
    void validate_nonMatchingPasswords() {
        // given
        given(context.buildConstraintViolationWithTemplate(anyString())).willReturn(builder);
        given(builder.addPropertyNode(anyString())).willReturn(nodeBuilder);

        TestObject testObj = new TestObject();
        testObj.password = "SecureBoy123!";
        testObj.confirmPassword = "DifferentBoy123!";

        // when / then
        assertThat(validator.isValid(testObj, context)).isFalse();
    }

    @Test
    @DisplayName("returns true when validated object is null")
    void validate_nullObject() {
        assertThat(validator.isValid(null, context)).isTrue();
    }

    @Test
    @DisplayName("returns true when both passwords are null")
    void validate_bothPasswordsNull() {
        TestObject testObj = new TestObject();
        testObj.password = null;
        testObj.confirmPassword = null;

        assertThat(validator.isValid(testObj, context)).isTrue();
    }

    @Test
    @DisplayName("returns true when both passwords are empty")
    void validate_bothPasswordsEmpty() {
        TestObject testObj = new TestObject();
        testObj.password = "";
        testObj.confirmPassword = "";

        assertThat(validator.isValid(testObj, context)).isTrue();
    }

    @Test
    @DisplayName("returns false when only one password is null")
    void validate_onePasswordNullOtherNot() {
        // given
        given(context.buildConstraintViolationWithTemplate(anyString())).willReturn(builder);
        given(builder.addPropertyNode(anyString())).willReturn(nodeBuilder);

        TestObject testObj = new TestObject();
        testObj.password = "SecureBoy123!";
        testObj.confirmPassword = null;

        // when / then
        assertThat(validator.isValid(testObj, context)).isFalse();
    }
}
