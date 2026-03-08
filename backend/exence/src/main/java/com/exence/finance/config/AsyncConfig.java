package com.exence.finance.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig {
    // Virtual thread executor is auto-configured by Spring Boot
    // via spring.threads.virtual.enabled=true in application.yml
}
