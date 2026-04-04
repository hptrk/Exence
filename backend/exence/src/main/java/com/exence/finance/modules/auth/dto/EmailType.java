package com.exence.finance.modules.auth.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EmailType {
    EMAIL_VERIFICATION("verify-email", "Verify your Exence account"),
    PASSWORD_RESET("reset-password", "Reset your Exence password"),
    WELCOME("welcome", "Welcome to Exence!"),
    REMINDER("reminder", "Just checking in!");

    private final String templateName;

    private final String subject;
}
