package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.modules.auth.entity.PasswordHistory;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.PasswordHistoryRepository;
import com.exence.finance.modules.auth.service.PasswordHistoryService;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordHistoryServiceImpl implements PasswordHistoryService {

    private final PasswordHistoryRepository passwordHistoryRepository;

    @Override
    @WriteTransactional
    public void savePasswordToHistory(User user, String encodedPassword) {
        PasswordHistory passwordHistory = PasswordHistory.builder()
                .user(user)
                .passwordHash(encodedPassword)
                .createdAt(Instant.now())
                .build();

        passwordHistoryRepository.save(passwordHistory);
    }
}
