package com.exence.finance.modules.systemsettings.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(title = "System Settings Response DTO", description = "Used for retrieving global system settings.")
public record SystemSettingsResponse(
        @Schema(
                        description = "Whether registration is restricted to whitelisted email domains only.",
                        example = "false")
                boolean domainWhitelistOnly,
        @Schema(
                        description =
                                "List of URL path patterns that require email verification before access is granted.",
                        example = "[\"/api/transactions\", \"/api/investments\"]")
                List<String> verificationRequiredPaths,
        @Schema(description = "Whether rate limiting is enabled for sensitive endpoints.", example = "true")
                boolean rateLimitingEnabled,
        @Schema(description = "Cooldown period in minutes applied when rate limiting is triggered.", example = "15")
                int rateLimitingCooldownMinutes,
        @Schema(
                        description = "Whether changing a password invalidates all active sessions across all devices.",
                        example = "true")
                boolean logoutFromAllDevices,
        @Schema(description = "Number of previous passwords stored per user to prevent password reuse.", example = "5")
                int passwordHistoryCount) {}
