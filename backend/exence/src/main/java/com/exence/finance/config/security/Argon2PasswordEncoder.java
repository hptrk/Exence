package com.exence.finance.config.security;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import org.springframework.security.crypto.password.PasswordEncoder;

// Uses the same default parameters as Spring Security's Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8()
public class Argon2PasswordEncoder implements PasswordEncoder {

    // Spring Security v5.8 defaults
    private static final int SALT_LENGTH = 16;
    private static final int HASH_LENGTH = 32;
    private static final int PARALLELISM = 1;
    private static final int MEMORY = 16384; // 16 MB
    private static final int ITERATIONS = 2;

    private final Argon2 argon2;

    public Argon2PasswordEncoder() {
        this.argon2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id, SALT_LENGTH, HASH_LENGTH);
    }

    @Override
    public String encode(CharSequence rawPassword) {
        return argon2.hash(ITERATIONS, MEMORY, PARALLELISM, rawPassword.toString().toCharArray());
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return argon2.verify(encodedPassword, rawPassword.toString().toCharArray());
    }

    @Override
    public boolean upgradeEncoding(String encodedPassword) {
        return false;
    }
}
