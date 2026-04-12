package com.exence.finance.modules.workspace.controller.impl;

import com.exence.finance.modules.workspace.controller.WorkspaceController;
import com.exence.finance.modules.workspace.dto.WorkspaceCreateRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceRenameRequest;
import com.exence.finance.modules.workspace.service.WorkspaceService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceControllerImpl implements WorkspaceController {

    private final WorkspaceService workspaceService;

    @Override
    @PostMapping
    public ResponseEntity<WorkspaceGetDTO> createWorkspace(@RequestBody @Valid WorkspaceCreateRequest request) {
        return ResponseEntity.ok(workspaceService.createWorkspace(request));
    }

    @Override
    @GetMapping
    public ResponseEntity<List<WorkspaceGetDTO>> getMyWorkspaces() {
        return ResponseEntity.ok(workspaceService.getMyWorkspaces());
    }

    @Override
    @PatchMapping("/{workspaceId}")
    public ResponseEntity<WorkspaceGetDTO> renameWorkspace(
            @PathVariable Long workspaceId, @RequestBody @Valid WorkspaceRenameRequest request) {
        return ResponseEntity.ok(workspaceService.renameWorkspace(workspaceId, request));
    }

    @Override
    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable Long workspaceId) {
        workspaceService.deleteWorkspace(workspaceId);
        return ResponseEntity.noContent().build();
    }

    @Override
    @PostMapping("/{workspaceId}/members")
    public ResponseEntity<WorkspaceMemberGetDTO> addMember(
            @PathVariable Long workspaceId, @RequestBody @Valid WorkspaceMemberEmailRequest request) {
        return ResponseEntity.ok(workspaceService.addMember(workspaceId, request));
    }

    @Override
    @GetMapping("/{workspaceId}/members")
    public ResponseEntity<List<WorkspaceMemberGetDTO>> getMembers(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(workspaceService.getMembers(workspaceId));
    }

    @Override
    @DeleteMapping("/{workspaceId}/members/me")
    public ResponseEntity<Void> removeSelf(@PathVariable Long workspaceId) {
        workspaceService.removeSelf(workspaceId);
        return ResponseEntity.noContent().build();
    }

    @Override
    @DeleteMapping("/{workspaceId}/members")
    public ResponseEntity<Void> removeMemberByEmail(
            @PathVariable Long workspaceId, @RequestBody @Valid WorkspaceMemberEmailRequest request) {
        workspaceService.removeMemberByEmail(workspaceId, request);
        return ResponseEntity.noContent().build();
    }
}
