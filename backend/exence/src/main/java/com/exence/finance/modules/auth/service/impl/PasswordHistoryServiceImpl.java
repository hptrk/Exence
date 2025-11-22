package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.modules.auth.entity.PasswordHistory;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.PasswordHistoryRepository;
import com.exence.finance.modules.auth.service.PasswordHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PasswordHistoryServiceImpl implements PasswordHistoryService {

    private final PasswordHistoryRepository passwordHistoryRepository;

    @Override
    @Transactional
    public void savePasswordToHistory(User user, String encodedPassword) {
        PasswordHistory passwordHistory = PasswordHistory.builder()
                .user(user)
                .passwordHash(encodedPassword)
                .createdAt(Instant.now())
                .build();

        passwordHistoryRepository.save(passwordHistory);
    }
}
