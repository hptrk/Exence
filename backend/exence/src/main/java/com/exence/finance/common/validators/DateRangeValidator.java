package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.ValidDateRange;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.time.Instant;

@Component
public class DateRangeValidator implements ConstraintValidator<ValidDateRange, Object> {

    private String fromFieldName;
    private String toFieldName;

    @Override
    public void initialize(ValidDateRange constraintAnnotation) {
        this.fromFieldName = constraintAnnotation.from();
        this.toFieldName = constraintAnnotation.to();
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        if (obj == null) {
            return true;
        }

        try {
            Object fromValue = getFieldValue(obj, fromFieldName);
            Object toValue = getFieldValue(obj, toFieldName);

            if (fromValue == null || toValue == null) {
                return true;
            }

            if (fromValue instanceof Instant && toValue instanceof Instant) {
                Instant fromDate = (Instant) fromValue;
                Instant toDate = (Instant) toValue;

                if (fromDate.isAfter(toDate)) {
                    addConstraintViolation(context, "Date from cannot be after date to");
                    return false;
                }
            }

            return true;

        } catch (Exception e) {
            return true;
        }
    }

    private Object getFieldValue(Object obj, String fieldName) throws NoSuchFieldException, IllegalAccessException {
        Field field = obj.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(obj);
    }

    private void addConstraintViolation(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(fromFieldName)
                .addConstraintViolation();
    }
}