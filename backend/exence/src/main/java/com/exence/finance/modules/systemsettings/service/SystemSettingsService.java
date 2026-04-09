package com.exence.finance.modules.systemsettings.service;

import com.exence.finance.modules.systemsettings.dto.SystemSettingsPatchRequest;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsResponse;
import com.exence.finance.modules.systemsettings.entity.SystemSettings;

public interface SystemSettingsService {

    SystemSettings getSettings();

    SystemSettingsResponse updateSettings(SystemSettingsPatchRequest request);
}
