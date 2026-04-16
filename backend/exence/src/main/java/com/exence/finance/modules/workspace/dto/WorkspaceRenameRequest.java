package com.exence.finance.modules.workspace.dto;

import com.exence.finance.common.util.ValidationConstants;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(title = "Workspace Rename Request DTO", description = "Data required to rename a workspace.")
public record WorkspaceRenameRequest(
        @Schema(description = "New name for the workspace.", example = "Family Workspace")
                @NotBlank(message = "{validation.workspace.name.not-blank}")
                @Size(max = ValidationConstants.WORKSPACE_NAME_MAX_LENGTH, message = "{validation.workspace.name.size}")
                String name) {}
