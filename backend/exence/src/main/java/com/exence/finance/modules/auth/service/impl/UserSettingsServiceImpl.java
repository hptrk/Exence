package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;
import com.exence.finance.modules.auth.entity.UserSettings;
import com.exence.finance.modules.auth.mapper.UserSettingsMapper;
import com.exence.finance.modules.auth.repository.UserSettingsRepository;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.auth.service.UserSettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSettingsServiceImpl implements UserSettingsService {
    private final UserSettingsRepository userSettingsRepository;
    private final UserSettingsMapper userSettingsMapper;
    private final UserService userService;

    @Override
    @ReadTransactional
    public UserSettingsResponse getCurrentUserSettings() {
        return userSettingsMapper.toResponse(getCurrentSettings());
    }

    @Override
    @WriteTransactional
    public UserSettingsResponse updateCurrentUserSettings(UpdateUserSettingsRequest request) {
        UserSettings settings = getCurrentSettings();
        userSettingsMapper.updateFromRequest(request, settings);
        settings = userSettingsRepository.save(settings);
        return userSettingsMapper.toResponse(settings);
    }

    private UserSettings getCurrentSettings() {
        Long userId = userService.getCurrentUserId();
        return userSettingsRepository
                .findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Settings not found for user " + userId));
    }
}
