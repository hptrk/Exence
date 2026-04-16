package com.exence.finance.modules.workspace.dto;

import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Workspace Get DTO", description = "Used for retrieving information about a workspace.")
public record WorkspaceGetDTO(
        @Schema(description = "Unique identifier of the workspace", example = "1") Long id,
        @Schema(description = "Name of the workspace", example = "Winston's Workspace") String name,
        @Schema(description = "Role of the user in the workspace", example = "OWNER") WorkspaceRole role) {}
