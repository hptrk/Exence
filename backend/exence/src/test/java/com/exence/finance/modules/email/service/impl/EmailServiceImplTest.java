package com.exence.finance.modules.email.service.impl;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;

import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.config.properties.EmailProperties;
import com.exence.finance.config.properties.ExenceProperties;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.email.service.EmailLogService;
import com.exence.finance.modules.email.service.EmailTemplateService;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class)
class EmailServiceImplTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private ExenceProperties exenceProperties;

    @Mock
    private EmailProperties emailProperties;

    @Mock
    private EmailTemplateService emailTemplateService;

    @Mock
    private EmailLogService emailLogService;

    @InjectMocks
    private EmailServiceImpl service;

    @Test
    @DisplayName("send verification email valid")
    void sendVerificationEmail_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        MimeMessage mimeMessage = mock(MimeMessage.class);

        given(exenceProperties.frontendUrl()).willReturn("https://app.exence.com");
        given(emailTemplateService.processTemplate(any(), any())).willReturn("<html>Verify</html>");
        given(mailSender.createMimeMessage()).willReturn(mimeMessage);
        given(emailProperties.username()).willReturn("noreply@exence.com");

        // when
        service.sendVerificationEmail(user, "verify-token-123");

        // then
        then(mailSender).should().send(any(MimeMessage.class));
        then(emailLogService).should().logEmailSent(any(), any(), anyString(), anyString());
    }

    @Test
    @DisplayName("send password reset email valid")
    void sendPasswordResetEmail_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        MimeMessage mimeMessage = mock(MimeMessage.class);

        given(exenceProperties.frontendUrl()).willReturn("https://app.exence.com");
        given(emailTemplateService.processTemplate(any(), any())).willReturn("<html>Reset</html>");
        given(mailSender.createMimeMessage()).willReturn(mimeMessage);
        given(emailProperties.username()).willReturn("noreply@exence.com");

        // when
        service.sendPasswordResetEmail(user, "reset-token-123");

        // then
        then(mailSender).should().send(any(MimeMessage.class));
        then(emailLogService).should().logEmailSent(any(), any(), anyString(), anyString());
    }

    @Test
    @DisplayName("send welcome email valid")
    void sendWelcomeEmail_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        MimeMessage mimeMessage = mock(MimeMessage.class);

        given(exenceProperties.frontendUrl()).willReturn("https://app.exence.com");
        given(emailTemplateService.processTemplate(any(), any())).willReturn("<html>Welcome</html>");
        given(mailSender.createMimeMessage()).willReturn(mimeMessage);
        given(emailProperties.username()).willReturn("noreply@exence.com");

        // when
        service.sendWelcomeEmail(user);

        // then
        then(mailSender).should().send(any(MimeMessage.class));
        then(emailLogService).should().logEmailSent(any(), any(), anyString(), anyString());
    }
}
