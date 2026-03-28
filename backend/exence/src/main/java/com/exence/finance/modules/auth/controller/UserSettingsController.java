package com.exence.finance.modules.auth.controller;

import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;
import org.springframework.http.ResponseEntity;

public interface UserSettingsController {
    ResponseEntity<UserSettingsResponse> getUserSettings();

    ResponseEntity<UserSettingsResponse> updateUserSettings(UpdateUserSettingsRequest request);
}
