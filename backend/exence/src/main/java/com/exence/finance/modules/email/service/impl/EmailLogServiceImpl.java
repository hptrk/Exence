package com.exence.finance.modules.email.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.modules.auth.dto.EmailType;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.email.dto.EmailStatus;
import com.exence.finance.modules.email.entity.EmailLog;
import com.exence.finance.modules.email.repository.EmailLogRepository;
import com.exence.finance.modules.email.service.EmailLogService;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailLogServiceImpl implements EmailLogService {
    private static final long SECONDS_PER_MINUTE = 60;

    private final EmailLogRepository emailLogRepository;

    @Override
    @WriteTransactional
    public EmailLog logEmailSent(User user, EmailType emailType, String subject, String recipientEmail) {
        EmailLog emailLog = EmailLog.builder()
                .user(user)
                .recipientEmail(recipientEmail)
                .emailType(emailType)
                .subject(subject)
                .status(EmailStatus.SENT)
                .build();

        return emailLogRepository.save(emailLog);
    }

    @Override
    @WriteTransactional
    public EmailLog logEmailFailed(
            User user, EmailType emailType, String subject, String recipientEmail, String errorMessage) {
        EmailLog emailLog = EmailLog.builder()
                .user(user)
                .recipientEmail(recipientEmail)
                .emailType(emailType)
                .subject(subject)
                .status(EmailStatus.FAILED)
                .errorMessage(errorMessage)
                .build();

        return emailLogRepository.save(emailLog);
    }

    @Override
    @ReadTransactional
    public boolean hasRecentEmail(User user, EmailType emailType, int sinceMinutes) {
        return emailLogRepository.existsByUserAndEmailTypeAndSentAtAfter(
                user, emailType, Instant.now().minusSeconds(sinceMinutes * SECONDS_PER_MINUTE));
    }
}
