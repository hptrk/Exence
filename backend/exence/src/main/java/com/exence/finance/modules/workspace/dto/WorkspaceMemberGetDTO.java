package com.exence.finance.modules.workspace.dto;

import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(title = "Workspace Member Get DTO", description = "Used for retrieving information about a workspace member.")
public record WorkspaceMemberGetDTO(
        @Schema(description = "Unique identifier of the user", example = "2") Long userId,
        @Schema(description = "Username of the user", example = "Jules") String username,
        @Schema(description = "Email of the user", example = "jules@exence.com") String email,
        @Schema(description = "Role of the user in the workspace", example = "MEMBER") WorkspaceRole role,
        @Schema(description = "Timestamp when the user joined the workspace", example = "2026-06-01T12:00:00Z")
                Instant joinedAt) {}
