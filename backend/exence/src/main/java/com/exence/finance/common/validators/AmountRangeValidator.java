package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.ValidAmountRange;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.math.BigDecimal;

@Component
public class AmountRangeValidator implements ConstraintValidator<ValidAmountRange, Object> {

    private String fromFieldName;
    private String toFieldName;

    @Override
    public void initialize(ValidAmountRange constraintAnnotation) {
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

            BigDecimal fromAmount = convertToBigDecimal(fromValue);
            BigDecimal toAmount = convertToBigDecimal(toValue);

            if (fromAmount == null || toAmount == null) {
                return true;
            }

            if (fromAmount.compareTo(toAmount) > 0) {
                addConstraintViolation(context, "Amount from cannot be greater than amount to");
                return false;
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

    private BigDecimal convertToBigDecimal(Object value) {
        if (value == null) {
            return null;
        }

        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }

        if (value instanceof Number) {
            return new BigDecimal(value.toString());
        }

        if (value instanceof String) {
            try {
                return new BigDecimal((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }

        return null;
    }

    private void addConstraintViolation(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();

        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(fromFieldName)
                .addConstraintViolation();

        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(toFieldName)
                .addConstraintViolation();
    }
}