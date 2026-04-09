package com.exence.finance.modules.systemsettings.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsPatchRequest;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsResponse;
import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import com.exence.finance.modules.systemsettings.mapper.SystemSettingsMapper;
import com.exence.finance.modules.systemsettings.repository.SystemSettingsRepository;
import com.exence.finance.modules.systemsettings.service.SystemSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SystemSettingsServiceImpl implements SystemSettingsService {

    static final Long SETTINGS_ID = 1L;

    private final SystemSettingsRepository systemSettingsRepository;
    private final SystemSettingsMapper systemSettingsMapper;

    @Override
    @ReadTransactional
    @Cacheable("systemSettings")
    public SystemSettings getSettings() {
        return systemSettingsRepository
                .findById(SETTINGS_ID)
                .orElseThrow(() -> new IllegalStateException("System settings not found in database"));
    }

    @Override
    @WriteTransactional
    @CacheEvict(value = "systemSettings", allEntries = true)
    public SystemSettingsResponse updateSettings(SystemSettingsPatchRequest request) {
        SystemSettings settings = systemSettingsRepository
                .findById(SETTINGS_ID)
                .orElseThrow(() -> new IllegalStateException("System settings not found in database"));

        if (request.domainWhitelistOnly() != null) {
            settings.setDomainWhitelistOnly(request.domainWhitelistOnly());
        }
        if (request.verificationRequiredPaths() != null) {
            settings.setVerificationRequiredPaths(request.verificationRequiredPaths());
        }
        if (request.rateLimitingEnabled() != null) {
            settings.setRateLimitingEnabled(request.rateLimitingEnabled());
        }
        if (request.rateLimitingCooldownMinutes() != null) {
            settings.setRateLimitingCooldownMinutes(request.rateLimitingCooldownMinutes());
        }
        if (request.logoutFromAllDevices() != null) {
            settings.setLogoutFromAllDevices(request.logoutFromAllDevices());
        }
        if (request.passwordHistoryCount() != null) {
            settings.setPasswordHistoryCount(request.passwordHistoryCount());
        }

        return systemSettingsMapper.toResponse(systemSettingsRepository.save(settings));
    }
}
