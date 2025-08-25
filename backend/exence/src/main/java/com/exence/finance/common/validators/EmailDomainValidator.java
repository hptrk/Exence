package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.ValidEmailDomain;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import static com.exence.finance.common.util.ValidationConstants.BLACKLISTED_DOMAINS;
import static com.exence.finance.common.util.ValidationConstants.WHITELISTED_DOMAINS;

@Component
public class EmailDomainValidator implements ConstraintValidator<ValidEmailDomain, String> {

    @Value("${exence.email.whitelist-only:false}")
    private boolean whitelistOnly;

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
            context.buildConstraintViolationWithTemplate(
                    "Temporary email addresses are not allowed"
            ).addConstraintViolation();
            return false;
        }

        if (whitelistOnly && !WHITELISTED_DOMAINS.contains(domain.toLowerCase())) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    "Only specific email providers are allowed"
            ).addConstraintViolation();
            return false;
        }

        return true;
    }

    private String extractDomain(String email) {
        int atIndex = email.lastIndexOf('@');
        if (atIndex == -1 || atIndex == email.length() - 1) {
            return null;
        }
        return email.substring(atIndex + 1);
    }
}