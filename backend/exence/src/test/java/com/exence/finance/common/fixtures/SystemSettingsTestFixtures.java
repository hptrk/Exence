package com.exence.finance.common.fixtures;

import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import java.util.List;

public final class SystemSettingsTestFixtures {

    private SystemSettingsTestFixtures() {}

    public static SystemSettings systemSettings(boolean rateLimitingEnabled, int cooldownMinutes) {
        SystemSettings s = new SystemSettings();
        s.setRateLimitingEnabled(rateLimitingEnabled);
        s.setRateLimitingCooldownMinutes(cooldownMinutes);
        return s;
    }

    public static SystemSettings systemSettingsWithPasswordHistoryCount(int count) {
        SystemSettings s = new SystemSettings();
        s.setPasswordHistoryCount(count);
        return s;
    }

    public static SystemSettings systemSettingsWithVerificationRequiredPaths(List<String> paths) {
        SystemSettings s = new SystemSettings();
        s.setVerificationRequiredPaths(paths);
        return s;
    }
}
