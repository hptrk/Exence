package com.exence.finance.validators;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.common.validators.PasswordValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
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
        validator = new PasswordValidator(i18n);
    }

    @Test
    @DisplayName("returns true for valid complex passwords")
    void validate_complexPassword() {
        // given
        String first = "SecureBoy123!";
        String second = "Complex$very99";
        String third = "Strong&P@ssw0rd";

        // when / then
        assertThat(validator.isValid(first, context)).isTrue();
        assertThat(validator.isValid(second, context)).isTrue();
        assertThat(validator.isValid(third, context)).isTrue();
    }

    @Test
    @DisplayName("returns false when password has no lowercase letters")
    void validate_withoutLowercase() {
        // given
        given(i18n.get(eq("validation.password.lowercase"))).willReturn("must have lowercase");
        given(i18n.get(eq("validation.password.violations"), any())).willReturn("Password validation failed");
        given(context.buildConstraintViolationWithTemplate(anyString())).willReturn(builder);

        // when
        boolean result = validator.isValid("UPPERCASE123!", context);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("returns false when password has no uppercase letters")
    void validate_withoutUppercase() {
        // given
        given(i18n.get(eq("validation.password.uppercase"))).willReturn("must have uppercase");
        given(i18n.get(eq("validation.password.violations"), any())).willReturn("Password validation failed");
        given(context.buildConstraintViolationWithTemplate(anyString())).willReturn(builder);

        // when
        boolean result = validator.isValid("lowercase123!", context);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("returns false when password has no digits")
    void validate_withoutDigit() {
        // given
        given(i18n.get(eq("validation.password.digit"))).willReturn("must have digit");
        given(i18n.get(eq("validation.password.violations"), any())).willReturn("Password validation failed");
        given(context.buildConstraintViolationWithTemplate(anyString())).willReturn(builder);

        // when
        boolean result = validator.isValid("NoDigitsHere!", context);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("returns false when password has no special character")
    void validate_withoutSpecialChar() {
        // given
        given(i18n.get(eq("validation.password.special-char"), any())).willReturn("must have special char");
        given(i18n.get(eq("validation.password.violations"), any())).willReturn("Password validation failed");
        given(context.buildConstraintViolationWithTemplate(anyString())).willReturn(builder);

        // when
        boolean result = validator.isValid("NoSpecialChar1221", context);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("returns true for null or blank passwords")
    void validate_nullOrBlank() {
        // when / then
        assertThat(validator.isValid(null, context)).isTrue();
        assertThat(validator.isValid("", context)).isTrue();
        assertThat(validator.isValid("   ", context)).isTrue();
    }
}
