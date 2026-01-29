package com.exence.finance.config.properties;

import java.util.List;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "exence.email")
public class EmailBusinessProperties {

    private boolean domainWhitelistOnly;

    private List<String> verificationRequiredPaths;

    private RateLimiting rateLimiting = new RateLimiting();

    @Data
    public static class RateLimiting {

        private boolean enabled;

        private int cooldownMinutesBetweenSends;
    }
}
