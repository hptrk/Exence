package com.exence.finance.config.properties;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "exence.email")
public record EmailBusinessProperties(Reminder reminder) {

    public record Reminder(String cron, Duration inactivityPeriod) {}
}
