package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.ValidPassword;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import static com.exence.finance.common.util.ValidationConstants.PASSWORD_DIGIT_PATTERN;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_LOWERCASE_PATTERN;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_SPECIAL_CHAR_PATTERN;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_UPPERCASE_PATTERN;

@Component
public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {

    private static final Pattern LOWERCASE_PATTERN = Pattern.compile(PASSWORD_LOWERCASE_PATTERN);
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile(PASSWORD_UPPERCASE_PATTERN);
    private static final Pattern DIGIT_PATTERN = Pattern.compile(PASSWORD_DIGIT_PATTERN);
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile(PASSWORD_SPECIAL_CHAR_PATTERN);

    private static final List<String> COMMON_PASSWORDS = List.of(
            "password", "123456", "password123", "admin", "qwerty",
            "welcome", "monkey", "password1", "12345678", "welcome123",
            "admin123", "root"
    );

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.trim().isEmpty()) {
            return true;
        }

        List<String> violations = new ArrayList<>();

        if (!LOWERCASE_PATTERN.matcher(password).matches()) {
            violations.add("must contain at least one lowercase letter");
        }

        if (!UPPERCASE_PATTERN.matcher(password).matches()) {
            violations.add("must contain at least one uppercase letter");
        }

        if (!DIGIT_PATTERN.matcher(password).matches()) {
            violations.add("must contain at least one number");
        }

        if (!SPECIAL_CHAR_PATTERN.matcher(password).matches()) {
            violations.add("must contain at least one special character (!@#$%^&*()_+-=[]{}|;':\"\\,.<>/?)");
        }

        if (COMMON_PASSWORDS.contains(password.toLowerCase())) {
            violations.add("cannot be a common password");
        }

        if (!violations.isEmpty()) {
            context.disableDefaultConstraintViolation();
            String message = "Password " + String.join(", ", violations);
            context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
            return false;
        }

        return true;
    }

}