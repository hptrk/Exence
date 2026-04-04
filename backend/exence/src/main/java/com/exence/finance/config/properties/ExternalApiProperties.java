package com.exence.finance.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
@ConfigurationProperties(prefix = "external-apis")
public class ExternalApiProperties {

    private Frankfurter frankfurter = new Frankfurter();

    @Data
    public static class Frankfurter {
        private String baseUrl;

        private long timeout;
    }
}
