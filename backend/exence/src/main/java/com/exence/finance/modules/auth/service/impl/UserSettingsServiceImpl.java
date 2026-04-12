package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;
import com.exence.finance.modules.auth.entity.UserSettings;
import com.exence.finance.modules.auth.mapper.UserSettingsMapper;
import com.exence.finance.modules.auth.repository.UserSettingsRepository;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.auth.service.UserSettingsService;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.repository.WorkspaceSettingsRepository;
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
    private final WorkspaceSettingsRepository workspaceSettingsRepository;

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

    @Override
    public SupportedCurrency getUserBaseCurrency() {
        Long workspaceId = WorkspaceContextHolder.getWorkspaceId();
        if (workspaceId == null) {
            throw new ExenceException(ErrorCode.WORKSPACE_HEADER_MISSING);
        }
        return workspaceSettingsRepository
                .findBaseCurrencyByWorkspaceId(workspaceId)
                .orElseThrow(() -> new IllegalStateException("Settings not found for workspace " + workspaceId));
    }

    private UserSettings getCurrentSettings() {
        Long userId = userService.getCurrentUserId();
        return userSettingsRepository
                .findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Settings not found for user " + userId));
    }
}
