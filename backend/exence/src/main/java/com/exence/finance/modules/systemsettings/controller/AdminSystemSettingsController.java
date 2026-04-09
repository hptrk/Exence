package com.exence.finance.modules.systemsettings.controller;

import com.exence.finance.modules.systemsettings.dto.SystemSettingsPatchRequest;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsResponse;
import org.springframework.http.ResponseEntity;

public interface AdminSystemSettingsController {

    ResponseEntity<SystemSettingsResponse> getSettings();

    ResponseEntity<SystemSettingsResponse> updateSettings(SystemSettingsPatchRequest request);
}
