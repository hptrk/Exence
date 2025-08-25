package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.PasswordMatches;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;

@Component
public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    private String passwordFieldName;
    private String confirmPasswordFieldName;
    private String message;

    @Override
    public void initialize(PasswordMatches constraintAnnotation) {
        this.passwordFieldName = constraintAnnotation.password();
        this.confirmPasswordFieldName = constraintAnnotation.confirmPassword();
        this.message = constraintAnnotation.message();
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        if (obj == null) {
            return true;
        }

        try {
            Object password = getFieldValue(obj, passwordFieldName);
            Object confirmPassword = getFieldValue(obj, confirmPasswordFieldName);

            if (isNullOrEmpty(password) && isNullOrEmpty(confirmPassword)) {
                return true;
            }

            if (isNullOrEmpty(password) || isNullOrEmpty(confirmPassword)) {
                addConstraintViolation(context);
                return false;
            }

            boolean matches = password.equals(confirmPassword);

            if (!matches) {
                addConstraintViolation(context);
            }

            return matches;

        } catch (Exception e) {
            return true;
        }
    }

    private Object getFieldValue(Object obj, String fieldName) throws NoSuchFieldException, IllegalAccessException {
        Field field = obj.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(obj);
    }

    private boolean isNullOrEmpty(Object value) {
        return value == null || (value instanceof String && ((String) value).trim().isEmpty());
    }

    private void addConstraintViolation(ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();

        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(confirmPasswordFieldName)
                .addConstraintViolation();

        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(passwordFieldName)
                .addConstraintViolation();
    }
}