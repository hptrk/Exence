package com.exence.finance.modules.auth.dto;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionSummaryProjection {

    private String sessionId;

    private String userAgent;

    private String ipAddress;

    private Instant lastUsedAt;

    private Instant createdAt;
}
