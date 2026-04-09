package com.exence.finance.modules.systemsettings.dto;

import java.util.List;

public record SystemSettingsPatchRequest(
        Boolean domainWhitelistOnly,
        List<String> verificationRequiredPaths,
        Boolean rateLimitingEnabled,
        Integer rateLimitingCooldownMinutes,
        Boolean logoutFromAllDevices,
        Integer passwordHistoryCount) {}
