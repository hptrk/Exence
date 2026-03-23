package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.ValidLanguage;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Locale;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class ValidLanguageValidator implements ConstraintValidator<ValidLanguage, String> {

    private static final Set<String> ISO_LANGUAGES = Set.of(Locale.getISOLanguages());

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        return ISO_LANGUAGES.contains(value.toLowerCase(Locale.ROOT));
    }
}
