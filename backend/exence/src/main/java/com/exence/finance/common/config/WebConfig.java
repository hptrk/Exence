package com.exence.finance.common.config;

import com.exence.finance.common.converter.StringToTransactionTypeConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer{
    private final StringToTransactionTypeConverter stringToTransactionTypeConverter;

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(stringToTransactionTypeConverter);
    }

}