package com.exence.finance.modules.systemsettings.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.systemsettings.controller.AdminSystemSettingsController;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsPatchRequest;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsResponse;
import com.exence.finance.modules.systemsettings.mapper.SystemSettingsMapper;
import com.exence.finance.modules.systemsettings.service.SystemSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AdminSystemSettingsControllerImpl implements AdminSystemSettingsController {

    private final SystemSettingsService systemSettingsService;
    private final SystemSettingsMapper systemSettingsMapper;

    @GetMapping
    public ResponseEntity<SystemSettingsResponse> getSettings() {
        return ResponseFactory.ok(systemSettingsMapper.toResponse(systemSettingsService.getSettings()));
    }

    @PatchMapping
    public ResponseEntity<SystemSettingsResponse> updateSettings(@RequestBody SystemSettingsPatchRequest request) {
        return ResponseFactory.ok(systemSettingsService.updateSettings(request));
    }
}
