package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.entity.User;

public interface PasswordValidationService {

    void validatePasswordReset(User user, String newPassword);

    void validatePasswordChange(User user, String currentPassword, String newPassword);
}
