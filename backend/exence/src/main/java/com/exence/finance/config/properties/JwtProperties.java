package com.exence.finance.config.properties;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
        String secret,
        Duration accessTokenExpiration,
        Duration refreshTokenExpiration,
        Duration passwordResetTokenExpiration,
        Duration emailVerificationTokenExpiration,
        String cleanupInterval) {}
