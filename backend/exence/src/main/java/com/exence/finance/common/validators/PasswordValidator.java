package com.exence.finance.common.validators;

import static com.exence.finance.common.util.ValidationConstants.PASSWORD_DIGIT_PATTERN;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_LOWERCASE_PATTERN;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_SPECIAL_CHAR_PATTERN;
import static com.exence.finance.common.util.ValidationConstants.PASSWORD_UPPERCASE_PATTERN;

import com.exence.finance.common.annotations.ValidPassword;
import com.exence.finance.common.i18n.I18nService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {

    private static final int SPECIAL_CHAR_DISPLAY_OFFSET = 3;
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile(PASSWORD_LOWERCASE_PATTERN);
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile(PASSWORD_UPPERCASE_PATTERN);
    private static final Pattern DIGIT_PATTERN = Pattern.compile(PASSWORD_DIGIT_PATTERN);
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile(PASSWORD_SPECIAL_CHAR_PATTERN);

    private final I18nService i18n;

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.trim().isEmpty()) {
            return true;
        }

        List<String> violations = new ArrayList<>();

        if (!LOWERCASE_PATTERN.matcher(password).matches()) {
            violations.add(i18n.get("validation.password.lowercase"));
        }

        if (!UPPERCASE_PATTERN.matcher(password).matches()) {
            violations.add(i18n.get("validation.password.uppercase"));
        }

        if (!DIGIT_PATTERN.matcher(password).matches()) {
            violations.add(i18n.get("validation.password.digit"));
        }

        if (!SPECIAL_CHAR_PATTERN.matcher(password).matches()) {
            String specialChars = SPECIAL_CHAR_PATTERN
                    .toString()
                    .replace("\\\\", "")
                    .substring(
                            SPECIAL_CHAR_DISPLAY_OFFSET,
                            SPECIAL_CHAR_PATTERN.toString().length() - SPECIAL_CHAR_DISPLAY_OFFSET);
            violations.add(i18n.get("validation.password.special-char", specialChars));
        }

        if (!violations.isEmpty()) {
            context.disableDefaultConstraintViolation();
            String message = i18n.get("validation.password.violations", String.join(", ", violations));
            context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
            return false;
        }

        return true;
    }
}
