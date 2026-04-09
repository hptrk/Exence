package com.exence.finance.modules.systemsettings.dto;

import java.util.List;

public record SystemSettingsResponse(
        boolean domainWhitelistOnly,
        List<String> verificationRequiredPaths,
        boolean rateLimitingEnabled,
        int rateLimitingCooldownMinutes,
        boolean logoutFromAllDevices,
        int passwordHistoryCount) {}
