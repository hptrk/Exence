package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.UniqueEmail;
import com.exence.finance.modules.auth.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

    private final UserRepository userRepository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        // if email is null or empty, we consider it valid (other annotations should handle null/empty checks)
        if (email == null || email.trim().isEmpty()) {
            return true;
        }

        return userRepository.findByEmail(email.trim().toLowerCase()).isEmpty();
    }
}