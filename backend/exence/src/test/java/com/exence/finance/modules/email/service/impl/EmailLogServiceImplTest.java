package com.exence.finance.modules.email.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.modules.auth.dto.EmailType;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.email.dto.EmailStatus;
import com.exence.finance.modules.email.entity.EmailLog;
import com.exence.finance.modules.email.repository.EmailLogRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmailLogServiceImplTest {

    @Mock
    private EmailLogRepository emailLogRepository;

    @InjectMocks
    private EmailLogServiceImpl service;

    @Test
    @DisplayName("log email sent")
    void logEmailSent_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        EmailLog savedLog = EmailLog.builder().status(EmailStatus.SENT).build();
        given(emailLogRepository.save(any(EmailLog.class))).willReturn(savedLog);

        // when
        EmailLog result = service.logEmailSent(user, EmailType.WELCOME, "Welcome to Exence!", "test@example.com");

        // then
        assertThat(result.getStatus()).isEqualTo(EmailStatus.SENT);
    }

    @Test
    @DisplayName("log email failed")
    void logEmailFailed_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        EmailLog savedLog = EmailLog.builder().status(EmailStatus.FAILED).build();
        given(emailLogRepository.save(any(EmailLog.class))).willReturn(savedLog);

        // when
        EmailLog result =
                service.logEmailFailed(user, EmailType.WELCOME, "Welcome to Exence!", "test@example.com", "SMTP error");

        // then
        assertThat(result.getStatus()).isEqualTo(EmailStatus.FAILED);
    }

    @Test
    @DisplayName("has recent email")
    void hasRecentEmail_recent() {
        // given
        User user = UserTestFixtures.defaultUser();
        given(emailLogRepository.existsByUserAndEmailTypeAndSentAtAfter(any(), any(), any()))
                .willReturn(true);

        // when
        boolean result = service.hasRecentEmail(user, EmailType.EMAIL_VERIFICATION, 15);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("has no recent email")
    void hasRecentEmail_none() {
        // given
        User user = UserTestFixtures.defaultUser();
        given(emailLogRepository.existsByUserAndEmailTypeAndSentAtAfter(any(), any(), any()))
                .willReturn(false);

        // when
        boolean result = service.hasRecentEmail(user, EmailType.EMAIL_VERIFICATION, 15);

        // then
        assertThat(result).isFalse();
    }
}
