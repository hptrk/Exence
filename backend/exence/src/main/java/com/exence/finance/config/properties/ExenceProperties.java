package com.exence.finance.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Data
@ConfigurationProperties(prefix = "exence")
public class ExenceProperties {

    private String frontendUrl;

    private boolean logoutFromAllDevices;

    private int passwordHistoryCount;

    private boolean secureCookie;

}
