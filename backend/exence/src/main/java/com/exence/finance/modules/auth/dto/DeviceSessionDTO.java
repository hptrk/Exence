package com.exence.finance.modules.auth.dto;

import java.time.Instant;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class DeviceSessionDTO {

    private String sessionId;

    private String deviceName;

    private String browser;

    private String operatingSystem;

    private String ipAddress;

    private Instant lastUsedAt;

    private Instant createdAt;

    private boolean isCurrentSession;
}
