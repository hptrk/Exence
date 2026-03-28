package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.ValidColor;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class ValidColorValidator implements ConstraintValidator<ValidColor, String> {

    // Regex for hex color: # followed by 6 hex digits
    private static final Pattern HEX_COLOR_PATTERN = Pattern.compile("^#[0-9A-Fa-f]{6}$");

    private boolean allowNull;

    @Override
    public void initialize(ValidColor constraintAnnotation) {
        this.allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return allowNull;
        }

        if (value.trim().isEmpty()) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("{validation.color.invalid}")
                    .addConstraintViolation();
            return false;
        }

        String trimmedValue = value.trim();
        if (!HEX_COLOR_PATTERN.matcher(trimmedValue).matches()) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("{validation.color.invalid}")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
