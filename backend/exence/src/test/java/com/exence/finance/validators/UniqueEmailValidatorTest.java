package com.exence.finance.validators;

import com.exence.finance.common.validators.UniqueEmailValidator;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserRepository;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

public class UniqueEmailValidatorTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    private UniqueEmailValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new UniqueEmailValidator(userRepository);

        // lenient stubbing to avoid unnecessary strictness in tests
        lenient().when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(builder);
        lenient().when(builder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();
    }

    @Test
    void test_emailDoesNotExist() {
        String email = "test@citromail.hu";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertTrue(validator.isValid(email, context));
    }

    @Test
    void test_emailAlreadyExists() {
        String email = "test@citromail.hu";
        User existingUser = User.builder()
                .id(1L)
                .email(email)
                .username("lacika")
                .build();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existingUser));

        assertFalse(validator.isValid(email, context));
    }

    @Test
    void test_nullEmail() {
        assertTrue(validator.isValid(null, context));
    }

    @Test
    void test_emptyEmail() {
        assertTrue(validator.isValid("", context));
        assertTrue(validator.isValid("   ", context));
    }

    @Test
    void test_emailWithSpaces() {
        String emailWithSpaces = "  test@citromail.hu  ";
        String trimmedEmail = "test@citromail.hu";
        when(userRepository.findByEmail(trimmedEmail.toLowerCase())).thenReturn(Optional.empty());

        assertTrue(validator.isValid(emailWithSpaces, context));
    }

    @Test
    void test_emailCaseInsensitive() {
        String upperCaseEmail = "TEST@CITROMAIL.HU";
        String lowerCaseEmail = "test@citromail.hu";
        when(userRepository.findByEmail(lowerCaseEmail)).thenReturn(Optional.empty());

        assertTrue(validator.isValid(upperCaseEmail, context));
    }

    @Test
    void test_mixedCaseEmailExists() {
        String inputEmail = "Test@Citromail.HU";
        String normalizedEmail = "test@citromail.hu";
        User existingUser = User.builder()
                .id(1L)
                .email(normalizedEmail)
                .username("lacika")
                .build();
        when(userRepository.findByEmail(normalizedEmail)).thenReturn(Optional.of(existingUser));

        assertFalse(validator.isValid(inputEmail, context));
    }
}