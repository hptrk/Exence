package com.exence.finance.modules.workspace.service;

import com.exence.finance.modules.workspace.dto.WorkspaceCreateRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceRenameRequest;
import com.exence.finance.modules.workspace.entity.Workspace;
import java.util.List;

public interface WorkspaceService {

    Workspace getWorkspace(Long workspaceId);

    WorkspaceGetDTO createWorkspace(WorkspaceCreateRequest request);

    List<WorkspaceGetDTO> getMyWorkspaces();

    WorkspaceGetDTO renameWorkspace(Long workspaceId, WorkspaceRenameRequest request);

    void deleteWorkspace(Long workspaceId);

    WorkspaceMemberGetDTO addMember(Long workspaceId, WorkspaceMemberEmailRequest request);

    List<WorkspaceMemberGetDTO> getMembers(Long workspaceId);

    void removeSelf(Long workspaceId);

    void removeMemberByEmail(Long workspaceId, WorkspaceMemberEmailRequest request);
}
