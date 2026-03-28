package com.exence.finance.common.validators;

import static com.exence.finance.common.util.ValidationConstants.BLACKLISTED_DOMAINS;
import static com.exence.finance.common.util.ValidationConstants.WHITELISTED_DOMAINS;

import com.exence.finance.common.annotations.ValidEmailDomain;
import com.exence.finance.config.properties.EmailBusinessProperties;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailDomainValidator implements ConstraintValidator<ValidEmailDomain, String> {

    private final EmailBusinessProperties emailBusinessProperties;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null || email.trim().isEmpty()) {
            return true;
        }

        String domain = extractDomain(email);
        if (domain == null) {
            return false;
        }

        if (BLACKLISTED_DOMAINS.contains(domain.toLowerCase())) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("{validation.email.domain.blacklisted}")
                    .addConstraintViolation();
            return false;
        }

        if (emailBusinessProperties.isDomainWhitelistOnly() && !WHITELISTED_DOMAINS.contains(domain.toLowerCase())) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("{validation.email.domain.whitelisted-only}")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }

    private String extractDomain(String email) {
        return email != null && email.matches("^[^@]+@[^@]+$") ? email.substring(email.indexOf('@') + 1) : null;
    }
}
