package com.exence.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@ConfigurationPropertiesScan("com.exence.finance.config.properties")
@SuppressWarnings("checkstyle:HideUtilityClassConstructor")
public class ExenceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExenceApplication.class, args);
    }
}
