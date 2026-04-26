package com.exence.finance.modules.auth.service.impl;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.modules.auth.entity.PasswordHistory;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.PasswordHistoryRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PasswordHistoryServiceImplTest {

    @Mock
    private PasswordHistoryRepository passwordHistoryRepository;

    @InjectMocks
    private PasswordHistoryServiceImpl service;

    @Test
    @DisplayName("save password to history valid")
    void savePasswordToHistory_valid() {
        // given
        User user = UserTestFixtures.defaultUser();

        // when
        service.savePasswordToHistory(user, "$argon2id$oldEncodedPassword");

        // then
        then(passwordHistoryRepository).should().save(any(PasswordHistory.class));
    }
}
