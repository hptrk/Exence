package com.exence.finance.modules.systemsettings.entity;

import static com.exence.finance.common.util.ValidationConstants.PATHS_MAX_LENGTH;

import com.exence.finance.common.converter.StringListConverter;
import com.exence.finance.common.entity.BaseAuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettings {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "domain_whitelist_only", nullable = false)
    private boolean domainWhitelistOnly;

    @Column(name = "verification_required_paths", nullable = false, length = PATHS_MAX_LENGTH)
    @Convert(converter = StringListConverter.class)
    private List<String> verificationRequiredPaths;

    @Column(name = "rate_limiting_enabled", nullable = false)
    private boolean rateLimitingEnabled;

    @Column(name = "rate_limiting_cooldown_minutes", nullable = false)
    private int rateLimitingCooldownMinutes;

    @Column(name = "logout_from_all_devices", nullable = false)
    private boolean logoutFromAllDevices;

    @Column(name = "password_history_count", nullable = false)
    private int passwordHistoryCount;
}
