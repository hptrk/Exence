package com.exence.finance.modules.email.service.impl;

import com.exence.finance.modules.auth.dto.EmailType;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.email.dto.EmailStatus;
import com.exence.finance.modules.email.entity.EmailLog;
import com.exence.finance.modules.email.repository.EmailLogRepository;
import com.exence.finance.modules.email.service.EmailLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EmailLogServiceImpl implements EmailLogService {
    private final EmailLogRepository emailLogRepository;

    @Override
    @Transactional()
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
    @Transactional()
    public EmailLog logEmailFailed(User user, EmailType emailType, String subject, String recipientEmail, String errorMessage) {
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
    public boolean hasRecentEmail(User user, EmailType emailType, int sinceMinutes) {
        return emailLogRepository.existsByUserAndEmailTypeAndSentAtAfter(user, emailType, Instant.now().minusSeconds(sinceMinutes * 60L));
    }
}