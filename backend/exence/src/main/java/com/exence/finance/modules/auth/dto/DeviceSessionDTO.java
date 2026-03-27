package com.exence.finance.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(description = "DTO representing a device session for a user")
public record DeviceSessionDTO(
        @Schema(description = "Unique identifier for the session", example = "36822711-3390-4a4a-8210-9704ad1116ba")
        String sessionId,

        @Schema(description = "Name of the device used for the session", example = "Winston's iPhone")
        String deviceName,

        @Schema(description = "Browser used for the session", example = "Safari 16.4")
        String browser,

        @Schema(description = "Operating system of the device used for the session", example = "iOS 16.4")
        String operatingSystem,

        @Schema(description = "IP address from which the session was initiated", example = "192.168.1.100")
        String ipAddress,

        @Schema(
            description = "Timestamp of the last activity in the session in ISO 8601 format",
            example = "2026-03-20T13:28:38.664110Z")
        Instant lastUsedAt,

        @Schema(
            description = "Timestamp when the session was created in ISO 8601 format",
            example = "2026-03-20T12:00:00.000000Z")
        Instant createdAt,

        @Schema(description = "Indicates if this session is the current active session for the user", example = "true")
        boolean isCurrentSession) {}
