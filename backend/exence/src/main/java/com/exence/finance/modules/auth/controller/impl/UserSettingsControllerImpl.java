package com.exence.finance.modules.auth.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.auth.controller.UserSettingsController;
import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;
import com.exence.finance.modules.auth.service.UserSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/settings")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class UserSettingsControllerImpl implements UserSettingsController {
    private final UserSettingsService userSettingsService;

    @Override
    @GetMapping
    public ResponseEntity<UserSettingsResponse> getUserSettings() {
        return ResponseFactory.ok(userSettingsService.getCurrentUserSettings());
    }

    @Override
    @PatchMapping
    public ResponseEntity<UserSettingsResponse> updateUserSettings(
            @Valid @RequestBody UpdateUserSettingsRequest request) {
        return ResponseFactory.ok(userSettingsService.updateCurrentUserSettings(request));
    }
}
