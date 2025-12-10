package com.exence.finance.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

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