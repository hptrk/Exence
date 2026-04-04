package com.exence.finance.modules.email.scheduler;

import com.exence.finance.config.properties.EmailBusinessProperties;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.email.service.EmailService;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderEmailScheduler {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final EmailBusinessProperties emailBusinessProperties;

    @Scheduled(cron = "${exence.email.reminder.cron}")
    public void sendReminderEmails() {
        Instant threshold =
                Instant.now().minus(emailBusinessProperties.reminder().inactivityPeriod());
        List<User> inactiveUsers = userRepository.findInactiveUsers(threshold);

        log.info(
                "Reminder email job started - inactivity threshold: {}, inactive users found: {}",
                threshold,
                inactiveUsers.size());

        for (User user : inactiveUsers) {
            emailService.sendReminderEmail(user);
        }

        log.info("Reminder email job completed - sent {} reminder emails", inactiveUsers.size());
    }
}
