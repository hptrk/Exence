package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;

public interface UserSettingsService {
    UserSettingsResponse getCurrentUserSettings();

    UserSettingsResponse updateCurrentUserSettings(UpdateUserSettingsRequest request);
}
