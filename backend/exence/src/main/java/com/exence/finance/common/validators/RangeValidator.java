package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.ValidRange;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.lang.reflect.Field;
import org.springframework.stereotype.Component;

@Component
public class RangeValidator implements ConstraintValidator<ValidRange, Object> {

    private String fromFieldName;
    private String toFieldName;
    private String message;

    @Override
    public void initialize(ValidRange constraintAnnotation) {
        this.fromFieldName = constraintAnnotation.from();
        this.toFieldName = constraintAnnotation.to();
        this.message = constraintAnnotation.message();
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

            if (fromValue instanceof Comparable fromComparable && toValue instanceof Comparable toComparable) {
                @SuppressWarnings("unchecked")
                int cmp = fromComparable.compareTo(toComparable);
                if (cmp > 0) {
                    addConstraintViolation(context);
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

    private void addConstraintViolation(ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(fromFieldName)
                .addConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(toFieldName)
                .addConstraintViolation();
    }
}
