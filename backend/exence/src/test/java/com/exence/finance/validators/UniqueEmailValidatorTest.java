package com.exence.finance.validators;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.validators.UniqueEmailValidator;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserRepository;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class UniqueEmailValidatorTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ConstraintValidatorContext context;

    private UniqueEmailValidator validator;

    @BeforeEach
    void setUp() {
        validator = new UniqueEmailValidator(userRepository);
    }

    @Test
    @DisplayName("returns true when email does not exist")
    void validate_emailDoesNotExist() {
        // given
        String email = "test@example.com";
        given(userRepository.findByEmail(email)).willReturn(Optional.empty());

        // when / then
        assertThat(validator.isValid(email, context)).isTrue();
    }

    @Test
    @DisplayName("returns false when email already exists")
    void validate_emailAlreadyExists() {
        // given
        String email = "test@example.com";
        User existingUser = User.builder().id(1L).email(email).username("john").build();
        given(userRepository.findByEmail(email)).willReturn(Optional.of(existingUser));

        // when / then
        assertThat(validator.isValid(email, context)).isFalse();
    }

    @Test
    @DisplayName("returns true for null email")
    void validate_nullEmail() {
        assertThat(validator.isValid(null, context)).isTrue();
    }

    @Test
    @DisplayName("returns true for blank email")
    void validate_blankEmail() {
        assertThat(validator.isValid("", context)).isTrue();
        assertThat(validator.isValid("   ", context)).isTrue();
    }

    @Test
    @DisplayName("trims spaces before checking uniqueness")
    void validate_emailWithSpaces() {
        // given
        String emailWithSpaces = "  test@example.com  ";
        String trimmedEmail = "test@example.com";
        given(userRepository.findByEmail(trimmedEmail.toLowerCase())).willReturn(Optional.empty());

        // when / then
        assertThat(validator.isValid(emailWithSpaces, context)).isTrue();
    }

    @Test
    @DisplayName("normalizes case before checking uniqueness")
    void validate_emailCaseInsensitive() {
        // given
        String upperCaseEmail = "TEST@EXAMPLE.COM";
        String lowerCaseEmail = "test@example.com";
        given(userRepository.findByEmail(lowerCaseEmail)).willReturn(Optional.empty());

        // when / then
        assertThat(validator.isValid(upperCaseEmail, context)).isTrue();
    }

    @Test
    @DisplayName("returns false when normalized mixed-case email already exists")
    void validate_mixedCaseEmailExists() {
        // given
        String inputEmail = "Test@Example.COM";
        String normalizedEmail = "test@example.com";
        User existingUser =
                User.builder().id(1L).email(normalizedEmail).username("john").build();
        given(userRepository.findByEmail(normalizedEmail)).willReturn(Optional.of(existingUser));

        // when / then
        assertThat(validator.isValid(inputEmail, context)).isFalse();
    }
}
