package com.exence.finance.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

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
