package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.ValidMaterialIcon;
import com.exence.finance.modules.category.dto.MaterialIcon;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class ValidMaterialIconValidator implements ConstraintValidator<ValidMaterialIcon, String> {

    private static final Set<String> VALID_ICONS =
            Arrays.stream(MaterialIcon.values()).map(Enum::name).collect(Collectors.toSet());

    private boolean allowNull;

    @Override
    public void initialize(ValidMaterialIcon constraintAnnotation) {
        this.allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return allowNull;
        }

        if (value.trim().isEmpty()) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Material icon cannot be empty")
                    .addConstraintViolation();
            return false;
        }

        if (!VALID_ICONS.contains(value.trim())) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Material icon must be one of the predefined icon names")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
