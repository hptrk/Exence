package com.exence.finance.config;

import com.exence.finance.common.converter.StringToCategoryTypeConverter;
import com.exence.finance.common.converter.StringToTimeframeConverter;
import com.exence.finance.common.converter.StringToTransactionTypeConverter;
import com.exence.finance.security.EmailVerificationInterceptor;
import com.exence.finance.security.WorkspaceInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {
    private final StringToTransactionTypeConverter stringToTransactionTypeConverter;
    private final StringToCategoryTypeConverter stringToCategoryTypeConverter;
    private final StringToTimeframeConverter stringToTimeframeConverter;
    private final EmailVerificationInterceptor emailVerificationInterceptor;
    private final WorkspaceInterceptor workspaceInterceptor;

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(stringToTransactionTypeConverter);
        registry.addConverter(stringToCategoryTypeConverter);
        registry.addConverter(stringToTimeframeConverter);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(emailVerificationInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/auth/**");

        registry.addInterceptor(workspaceInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/auth/**", "/api/admin/**", "/api/exchange-rates/**", "/api/users/**", "/api/sessions/**");
    }
}
