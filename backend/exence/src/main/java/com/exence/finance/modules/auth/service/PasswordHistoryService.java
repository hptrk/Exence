package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.entity.User;

public interface PasswordHistoryService {

    void savePasswordToHistory(User user, String encodedPassword);
}
