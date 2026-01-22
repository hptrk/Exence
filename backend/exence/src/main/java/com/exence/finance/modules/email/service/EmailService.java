package com.exence.finance.modules.email.service;

import com.exence.finance.modules.auth.entity.User;

public interface EmailService {

    void sendVerificationEmail(User user, String token);

    void sendPasswordResetEmail(User user, String token);

    void sendWelcomeEmail(User user);
}
