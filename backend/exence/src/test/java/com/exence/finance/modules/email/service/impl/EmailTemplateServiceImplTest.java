package com.exence.finance.modules.email.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import com.exence.finance.modules.auth.dto.EmailType;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class EmailTemplateServiceImplTest {

    private final EmailTemplateServiceImpl service = new EmailTemplateServiceImpl();

    @Test
    @DisplayName("process template valid")
    void processTemplate_valid() {
        // given
        Map<String, String> variables = Map.of("username", "TestUser", "verificationUrl", "https://example.com/verify");

        // when
        String result = service.processTemplate(EmailType.EMAIL_VERIFICATION, variables);

        // then
        assertThat(result).isNotNull();
        assertThat(result).contains("TestUser");
    }

    @Test
    @DisplayName("process template null variable")
    void processTemplate_nullVariable() {
        // given
        Map<String, String> variables = new java.util.HashMap<>();
        variables.put("username", null);
        variables.put("verificationUrl", "https://example.com/verify");

        // when
        String result = service.processTemplate(EmailType.EMAIL_VERIFICATION, variables);

        // then
        assertThat(result).isNotNull();
    }
}
