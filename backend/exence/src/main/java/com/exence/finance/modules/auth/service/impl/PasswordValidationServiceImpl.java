package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.config.properties.ExenceProperties;
import com.exence.finance.modules.auth.entity.PasswordHistory;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.PasswordHistoryRepository;
import com.exence.finance.modules.auth.service.PasswordValidationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
            throw new ExenceException(ErrorCode.INVALID_PASSWORD, "current-incorrect");
        }
    }

    private void validatePasswordNotSameAsCurrent(User user, String newPassword) {
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new ExenceException(ErrorCode.INVALID_PASSWORD, "same-as-current");
        }
    }

    private void validatePasswordNotInHistory(User user, String newPassword) {
        List<PasswordHistory> recentPasswords = passwordHistoryRepository.findRecentPasswordsByUserId(
                user.getId(), exenceProperties.passwordHistoryCount());

        boolean isPasswordReused =
                recentPasswords.stream().anyMatch(ph -> passwordEncoder.matches(newPassword, ph.getPasswordHash()));

        if (isPasswordReused) {
            throw new ExenceException(ErrorCode.INVALID_PASSWORD, "reused", exenceProperties.passwordHistoryCount());
        }
    }
}
