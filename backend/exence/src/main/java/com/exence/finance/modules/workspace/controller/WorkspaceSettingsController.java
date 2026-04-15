package com.exence.finance.modules.workspace.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsPatchRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Workspace Settings", description = "Workspace-level settings and preferences")
public interface WorkspaceSettingsController {

    @ExenceOpenApi(
            summary = "Get workspace settings",
            description =
                    "Returns the settings of the currently active workspace, including the base currency and display"
                            + " preferences.",
            successStatus = 200,
            successDescription = "Workspace settings returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.WORKSPACE_NOT_FOUND})
    ResponseEntity<WorkspaceSettingsGetDTO> getWorkspaceSettings();

    @ExenceOpenApi(
            summary = "Update workspace settings",
            description =
                    "Partially updates the settings of the currently active workspace. Only the fields provided in the"
                            + " request body are modified. Only the workspace owner can update settings.",
            successStatus = 200,
            successDescription = "Updated workspace settings returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.WORKSPACE_NOT_FOUND,
                ErrorCode.WORKSPACE_OWNER_REQUIRED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<WorkspaceSettingsGetDTO> updateWorkspaceSettings(WorkspaceSettingsPatchRequest request);
}
