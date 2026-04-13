package com.exence.finance.modules.workspace.controller;

import com.exence.finance.modules.workspace.dto.WorkspaceSettingsGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsPatchRequest;
import org.springframework.http.ResponseEntity;

public interface WorkspaceSettingsController {

    ResponseEntity<WorkspaceSettingsGetDTO> getWorkspaceSettings();

    ResponseEntity<WorkspaceSettingsGetDTO> updateWorkspaceSettings(WorkspaceSettingsPatchRequest request);
}
