package com.exence.finance.common.fixtures;

import com.exence.finance.modules.auth.entity.PasswordHistory;
import com.exence.finance.modules.auth.entity.User;
import java.time.Instant;

public final class PasswordHistoryTestFixtures {

    private PasswordHistoryTestFixtures() {}

    public static PasswordHistory passwordHistoryWithHash(User user, String passwordHash) {
        return PasswordHistory.builder()
                .id(1L)
                .passwordHash(passwordHash)
                .createdAt(Instant.now())
                .user(user)
                .build();
    }
}
