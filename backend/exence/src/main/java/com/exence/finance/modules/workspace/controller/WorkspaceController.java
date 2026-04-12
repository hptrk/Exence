package com.exence.finance.modules.workspace.controller;

import com.exence.finance.modules.workspace.dto.WorkspaceCreateRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceRenameRequest;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface WorkspaceController {

    ResponseEntity<WorkspaceGetDTO> createWorkspace(WorkspaceCreateRequest request);

    ResponseEntity<List<WorkspaceGetDTO>> getMyWorkspaces();

    ResponseEntity<WorkspaceGetDTO> renameWorkspace(Long workspaceId, WorkspaceRenameRequest request);

    ResponseEntity<Void> deleteWorkspace(Long workspaceId);

    ResponseEntity<WorkspaceMemberGetDTO> addMember(Long workspaceId, WorkspaceMemberEmailRequest request);

    ResponseEntity<List<WorkspaceMemberGetDTO>> getMembers(Long workspaceId);

    ResponseEntity<Void> removeSelf(Long workspaceId);

    ResponseEntity<Void> removeMemberByEmail(Long workspaceId, WorkspaceMemberEmailRequest request);
}
