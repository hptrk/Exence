package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.exception.InvalidPasswordException;
import com.exence.finance.config.properties.ExenceProperties;
import com.exence.finance.modules.auth.entity.PasswordHistory;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.PasswordHistoryRepository;
import com.exence.finance.modules.auth.service.PasswordValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PasswordValidationServiceImpl implements PasswordValidationService {
    private final PasswordEncoder passwordEncoder;
    private final PasswordHistoryRepository passwordHistoryRepository;
    private final ExenceProperties exenceProperties;

    @Override
    public void validatePasswordReset(User user, String newPassword) {
        validatePasswordNotSameAsCurrent(user, newPassword);
        validatePasswordNotInHistory(user, newPassword);
    }

    @Override
    public void validatePasswordChange(User user, String currentPassword, String newPassword) {
        validateCurrentPassword(user, currentPassword);
        validatePasswordNotSameAsCurrent(user, newPassword);
        validatePasswordNotInHistory(user, newPassword);
    }

    private void validateCurrentPassword(User user, String currentPassword) {
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new InvalidPasswordException("Current password is incorrect");
        }
    }

    private void validatePasswordNotSameAsCurrent(User user, String newPassword) {
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new InvalidPasswordException("New password must be different from current password");
        }
    }

    private void validatePasswordNotInHistory(User user, String newPassword) {
        List<PasswordHistory> recentPasswords = passwordHistoryRepository
                .findRecentPasswordsByUserId(user.getId(), exenceProperties.getPasswordHistoryCount());

        boolean isPasswordReused = recentPasswords.stream()
                .anyMatch(ph -> passwordEncoder.matches(newPassword, ph.getPasswordHash()));

        if (isPasswordReused) {
            throw new InvalidPasswordException(
                    String.format("Password cannot be one of your last %d passwords", exenceProperties.getPasswordHistoryCount())
            );
        }
    }
}
