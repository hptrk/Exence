package com.exence.finance.config.properties;

import java.time.Duration;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private String secret;

    private Duration accessTokenExpiration;

    private Duration refreshTokenExpiration;

    private Duration passwordResetTokenExpiration;

    private Duration emailVerificationTokenExpiration;

    private String cleanupInterval;
}
