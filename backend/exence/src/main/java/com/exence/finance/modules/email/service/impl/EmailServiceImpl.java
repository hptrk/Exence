package com.exence.finance.modules.email.service.impl;

import com.exence.finance.config.properties.EmailProperties;
import com.exence.finance.config.properties.ExenceProperties;
import com.exence.finance.modules.auth.dto.EmailType;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.email.service.EmailLogService;
import com.exence.finance.modules.email.service.EmailTemplateService;
import com.exence.finance.modules.email.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    private final ExenceProperties exenceProperties;
    private final EmailProperties emailProperties;
    private final EmailTemplateService emailTemplateService;
    private final EmailLogService emailLogService;

    @Override
    public void sendVerificationEmail(User user, String token) {
        Map<String, String> variables = new HashMap<>();
        variables.put("username", user.getDisplayUsername());
        variables.put("verificationUrl", exenceProperties.getFrontendUrl() + "/auth/verify-email?token=" + token);

        sendTemplatedEmail(user, EmailType.EMAIL_VERIFICATION, variables);
    }

    @Override
    public void sendPasswordResetEmail(User user, String token) {
        Map<String, String> variables = new HashMap<>();
        variables.put("username", user.getDisplayUsername());
        variables.put("resetUrl", exenceProperties.getFrontendUrl() + "/auth/reset-password?token=" + token);

        sendTemplatedEmail(user, EmailType.PASSWORD_RESET, variables);
    }

    @Override
    public void sendWelcomeEmail(User user) {
        Map<String, String> variables = new HashMap<>();
        variables.put("username", user.getDisplayUsername());
        variables.put("dashboardUrl", exenceProperties.getFrontendUrl());

        sendTemplatedEmail(user, EmailType.WELCOME, variables);
    }

    private void sendTemplatedEmail(User user, EmailType emailType, Map<String, String> variables) {
        String recipientEmail = user.getEmail();
        String subject = emailType.getSubject();

        try {
            String htmlContent = emailTemplateService.processTemplate(emailType, variables);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailProperties.getUsername());
            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            emailLogService.logEmailSent(user, emailType, subject, recipientEmail);
            log.info("Email sent successfully - Type: {}, To: {}", emailType, recipientEmail);

        } catch (MessagingException e) {
            emailLogService.logEmailFailed(user, emailType, subject, recipientEmail, e.getMessage());
            log.error("Failed to send email - Type: {}, To: {}", emailType, recipientEmail, e);
        }
    }
}