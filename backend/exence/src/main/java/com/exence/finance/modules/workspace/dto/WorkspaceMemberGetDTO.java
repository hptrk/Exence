package com.exence.finance.modules.workspace.dto;

import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import java.time.Instant;

public record WorkspaceMemberGetDTO(Long userId, String username, String email, WorkspaceRole role, Instant joinedAt) {}
