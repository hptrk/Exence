package com.exence.finance.modules.email.service;

import com.exence.finance.modules.auth.dto.EmailType;

import java.util.Map;

public interface EmailTemplateService {

    String processTemplate(EmailType emailType, Map<String, String> variables);

}
