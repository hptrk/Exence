package com.exence.finance.modules.auth.dto;

import java.time.Instant;

public record DeviceSessionDTO(
        String sessionId,
        String deviceName,
        String browser,
        String operatingSystem,
        String ipAddress,
        Instant lastUsedAt,
        Instant createdAt,
        boolean isCurrentSession) {}
