package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.ValidCurrency;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Currency;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class ValidCurrencyValidator implements ConstraintValidator<ValidCurrency, String> {

    private static final Set<String> ISO_CURRENCIES = Currency.getAvailableCurrencies().stream()
            .map(Currency::getCurrencyCode)
            .collect(Collectors.toUnmodifiableSet());

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        return ISO_CURRENCIES.contains(value.toUpperCase(Locale.ROOT));
    }
}
