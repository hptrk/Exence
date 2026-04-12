package com.exence.finance.modules.workspace.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.workspace.controller.WorkspaceSettingsController;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsPatchRequest;
import com.exence.finance.modules.workspace.service.WorkspaceSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workspaces/settings")
@RequiredArgsConstructor
public class WorkspaceSettingsControllerImpl implements WorkspaceSettingsController {

    private final WorkspaceSettingsService workspaceSettingsService;

    @Override
    @GetMapping
    public ResponseEntity<WorkspaceSettingsGetDTO> getWorkspaceSettings() {
        return ResponseFactory.ok(workspaceSettingsService.getWorkspaceSettings());
    }

    @Override
    @PatchMapping
    public ResponseEntity<WorkspaceSettingsGetDTO> updateWorkspaceSettings(
            @Valid @RequestBody WorkspaceSettingsPatchRequest request) {
        return ResponseFactory.ok(workspaceSettingsService.updateWorkspaceSettings(request));
    }
}
