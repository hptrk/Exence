package com.exence.finance.modules.email.service;

import com.exence.finance.modules.auth.dto.EmailType;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.email.entity.EmailLog;

public interface EmailLogService {

    EmailLog logEmailSent(User user, EmailType emailType, String subject, String recipientEmail);

    EmailLog logEmailFailed(User user, EmailType emailType, String subject, String recipientEmail, String errorMessage);

    boolean hasRecentEmail(User user, EmailType emailType, int sinceMinutes);
}
