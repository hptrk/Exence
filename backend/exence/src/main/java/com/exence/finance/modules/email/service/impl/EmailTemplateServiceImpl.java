package com.exence.finance.modules.email.service.impl;

import com.exence.finance.modules.auth.dto.EmailType;
import com.exence.finance.modules.email.service.EmailTemplateService;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

@Service
@Slf4j
public class EmailTemplateServiceImpl implements EmailTemplateService {

    @Override
    public String processTemplate(EmailType emailType, Map<String, String> variables) {
        try {
            String templatePath = "templates/" + emailType.getTemplateName() + ".html";
            ClassPathResource resource = new ClassPathResource(templatePath);

            if (!resource.exists()) {
                log.error("Email template not found: {}", templatePath);
                return null;
            }

            String template = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);

            for (Map.Entry<String, String> entry : variables.entrySet()) {
                String placeholder = "{{" + entry.getKey() + "}}";
                template = template.replace(placeholder, entry.getValue() != null ? entry.getValue() : "");
            }

            return template;

        } catch (IOException e) {
            log.error("Error processing email template for type: {}", emailType, e);
            return null;
        }
    }
}
