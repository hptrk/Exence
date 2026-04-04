package com.exence.finance.config.properties;

import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "spring.mail")
public record EmailProperties(
        String host, int port, String username, String password, Map<String, Object> properties) {}
