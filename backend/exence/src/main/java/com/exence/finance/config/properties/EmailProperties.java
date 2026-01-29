package com.exence.finance.config.properties;

import java.util.Map;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "spring.mail")
public class EmailProperties {

    private String host;

    private int port;

    private String username;

    private String password;

    private Map<String, Object> properties;
}
