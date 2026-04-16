package com.exence.finance.modules.workspace.dto;

import com.exence.finance.common.annotations.ValidStrictEmail;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Workspace Member Email Request DTO", description = "Contains the email address of a workspace member.")
public record WorkspaceMemberEmailRequest(
        @Schema(description = "Email address of the user.", example = "jules@exence.com") @ValidStrictEmail
                String email) {}
