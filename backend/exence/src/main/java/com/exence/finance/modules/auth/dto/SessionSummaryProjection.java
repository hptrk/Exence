package com.exence.finance.modules.auth.dto;

import java.time.Instant;

public record SessionSummaryProjection(
        String sessionId, String userAgent, String ipAddress, Instant lastUsedAt, Instant createdAt) {}
