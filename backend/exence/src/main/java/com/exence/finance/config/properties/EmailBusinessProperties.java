package com.exence.finance.config.properties;

import java.time.Duration;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "exence.email")
public record EmailBusinessProperties(
        boolean domainWhitelistOnly,
        List<String> verificationRequiredPaths,
        RateLimiting rateLimiting,
        Reminder reminder) {

    public record RateLimiting(boolean enabled, int cooldownMinutesBetweenSends) {}

    public record Reminder(String cron, Duration inactivityPeriod) {}
}
