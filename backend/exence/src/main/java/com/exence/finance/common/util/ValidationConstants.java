package com.exence.finance.common.util;

import java.util.Set;

public class ValidationConstants {

    // User validations
    public static final int USERNAME_MIN_LENGTH = 3;
    public static final int USERNAME_MAX_LENGTH = 25;
    public static final String USERNAME_PATTERN = "^[a-zA-Z0-9_]+$";
    public static final String USERNAME_PATTERN_MESSAGE = "Username can only contain letters, numbers and underscores";
    public static final int EMAIL_MAX_LENGTH = 100;
    public static final String EMAIL_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; // extra strict regex

    // Token validations
    public static final int TOKEN_MAX_LENGTH = 512;
    public static final int IP_ADDRESS_MAX_LENGTH = 45; // supports IPv6
    public static final int USER_AGENT_MAX_LENGTH = 512;

    // Password validations
    public static final int PASSWORD_MIN_LENGTH = 8;
    public static final int PASSWORD_MAX_LENGTH = 100;
    // Password complexity requirements
    public static final String PASSWORD_LOWERCASE_PATTERN = ".*[a-z].*";
    public static final String PASSWORD_UPPERCASE_PATTERN = ".*[A-Z].*";
    public static final String PASSWORD_DIGIT_PATTERN = ".*\\d.*";
    public static final String PASSWORD_SPECIAL_CHAR_PATTERN = ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*";

    // Category validations
    public static final int CATEGORY_NAME_MIN_LENGTH = 1;
    public static final int CATEGORY_NAME_MAX_LENGTH = 25;
    public static final int CATEGORY_EMOJI_MAX_LENGTH = 50;

    // Transaction validations
    public static final int TRANSACTION_TITLE_MIN_LENGTH = 1;
    public static final int TRANSACTION_TITLE_MAX_LENGTH = 100;
    public static final String TRANSACTION_AMOUNT_MIN = "0.01";
    public static final int TRANSACTION_AMOUNT_INTEGER_DIGITS = 17;
    public static final int TRANSACTION_AMOUNT_FRACTION_DIGITS = 2;

    // Email domain lists
    public static final Set<String> WHITELISTED_DOMAINS = Set.of(
            "gmail.com",
            "yahoo.com",
            "outlook.com",
            "hotmail.com",
            "icloud.com",
            "aol.com",
            "protonmail.com",
            "zoho.com",
            "yandex.com",
            "mail.com"
    );
    public static final Set<String> BLACKLISTED_DOMAINS = Set.of(
            "10minutemail.com",
            "tempmail.org",
            "guerrillamail.com",
            "mailinator.com",
            "throwawaymail.com",
            "fakeinbox.com",
            "getnada.com",
            "dispostable.com",
            "trashmail.com",
            "maildrop.cc"
    );

    private ValidationConstants() {}
}
