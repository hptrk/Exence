package com.exence.finance.common.fixtures;

import com.exence.finance.modules.auth.entity.Role;
import com.exence.finance.modules.auth.entity.User;
import java.time.Instant;

public final class UserTestFixtures {

    private UserTestFixtures() {}

    public static User defaultUser() {
        return User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("$argon2id$encodedPassword")
                .emailVerified(true)
                .role(Role.USER)
                .createdAt(Instant.now())
                .build();
    }

    public static User unverifiedUser() {
        return User.builder()
                .id(2L)
                .username("unverified")
                .email("unverified@example.com")
                .password("$argon2id$encodedPassword")
                .emailVerified(false)
                .role(Role.USER)
                .createdAt(Instant.now())
                .build();
    }

    public static User adminUser() {
        return User.builder()
                .id(3L)
                .username("admin")
                .email("admin@example.com")
                .password("$argon2id$encodedPassword")
                .emailVerified(true)
                .role(Role.ADMIN)
                .createdAt(Instant.now())
                .build();
    }
}
