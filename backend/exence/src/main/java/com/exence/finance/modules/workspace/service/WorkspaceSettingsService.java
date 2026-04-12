package com.exence.finance.modules.workspace.service;

import com.exence.finance.modules.workspace.dto.WorkspaceSettingsGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsPatchRequest;

public interface WorkspaceSettingsService {

    WorkspaceSettingsGetDTO getWorkspaceSettings();

    WorkspaceSettingsGetDTO updateWorkspaceSettings(WorkspaceSettingsPatchRequest request);
}
