package com.exence.finance.modules.systemsettings.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(
        title = "System Settings Patch Request DTO",
        description = "For updating global system settings. All fields are optional.")
public record SystemSettingsPatchRequest(
        @Schema(
                        description = "Whether registration should be restricted to whitelisted email domains only.",
                        example = "false")
                Boolean domainWhitelistOnly,
        @Schema(
                        description =
                                "List of URL path patterns that should require email verification before access is"
                                        + " granted.",
                        example = "[\"/api/transactions\", \"/api/investments\"]")
                List<String> verificationRequiredPaths,
        @Schema(description = "Whether rate limiting should be enabled for sensitive endpoints.", example = "true")
                Boolean rateLimitingEnabled,
        @Schema(description = "Cooldown period in minutes to apply when rate limiting is triggered.", example = "15")
                Integer rateLimitingCooldownMinutes,
        @Schema(
                        description =
                                "Whether changing a password should invalidate all active sessions across all devices.",
                        example = "true")
                Boolean logoutFromAllDevices,
        @Schema(
                        description = "Number of previous passwords to store per user to prevent password reuse.",
                        example = "5")
                Integer passwordHistoryCount) {}
