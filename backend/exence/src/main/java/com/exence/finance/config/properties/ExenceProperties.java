package com.exence.finance.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "exence")
public record ExenceProperties(
        String frontendUrl, boolean logoutFromAllDevices, int passwordHistoryCount, boolean secureCookie) {}
