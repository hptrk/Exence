package com.exence.finance.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "external-apis")
public record ExternalApiProperties(Frankfurter frankfurter) {

    public record Frankfurter(String baseUrl, long timeout) {}
}
