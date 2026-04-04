package com.exence.finance.config.properties;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "exence.email")
public record EmailBusinessProperties(
        boolean domainWhitelistOnly, List<String> verificationRequiredPaths, RateLimiting rateLimiting) {

    public record RateLimiting(boolean enabled, int cooldownMinutesBetweenSends) {}
}
