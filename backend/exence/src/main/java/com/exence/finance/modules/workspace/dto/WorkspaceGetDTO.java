package com.exence.finance.modules.workspace.dto;

import com.exence.finance.modules.workspace.enums.WorkspaceRole;

public record WorkspaceGetDTO(Long id, String name, WorkspaceRole role) {}
