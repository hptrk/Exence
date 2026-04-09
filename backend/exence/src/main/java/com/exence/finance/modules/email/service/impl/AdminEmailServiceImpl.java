package com.exence.finance.modules.email.service.impl;

import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.email.dto.BroadcastEmailRequest;
import com.exence.finance.modules.email.service.AdminEmailService;
import com.exence.finance.modules.email.service.EmailService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminEmailServiceImpl implements AdminEmailService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    @WriteTransactional
    public void sendBroadcastEmailToAllUsers(BroadcastEmailRequest request) {
        List<User> users = userRepository.findAll();
        log.info("Sending broadcast email '{}' to {} users", request.subject(), users.size());

        for (User user : users) {
            emailService.sendBroadcastEmail(user, request.subject(), request.htmlContent());
        }

        log.info("Broadcast email '{}' dispatched to {} users", request.subject(), users.size());
    }
}
