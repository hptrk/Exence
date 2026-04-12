package com.exence.finance.modules.workspace.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.workspace.dto.WorkspaceCreateRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceRenameRequest;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import com.exence.finance.modules.workspace.mapper.WorkspaceMapper;
import com.exence.finance.modules.workspace.repository.WorkspaceRepository;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import com.exence.finance.modules.workspace.service.WorkspaceService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMembershipService workspaceMembershipService;
    private final WorkspaceMapper workspaceMapper;
    private final UserService userService;

    @Override
    @ReadTransactional
    public Workspace getWorkspace(Long workspaceId) {
        return workspaceRepository
                .findById(workspaceId)
                .orElseThrow(() -> new ExenceException(ErrorCode.WORKSPACE_NOT_FOUND));
    }

    @Override
    @WriteTransactional
    public WorkspaceGetDTO createWorkspace(WorkspaceCreateRequest request) {
        User currentUser = userService.getCurrentUser();
        Workspace workspace =
                workspaceMembershipService.createDefaultWorkspace(currentUser, request.name(), request.baseCurrency());
        return workspaceMapper.mapToGetDTO(workspace, currentUser.getId());
    }

    @Override
    @ReadTransactional
    public List<WorkspaceGetDTO> getMyWorkspaces() {
        Long userId = userService.getCurrentUserId();
        return workspaceRepository.findAllByUserId(userId).stream()
                .map(w -> workspaceMapper.mapToGetDTO(w, userId))
                .toList();
    }

    @Override
    @WriteTransactional
    public WorkspaceGetDTO renameWorkspace(Long workspaceId, WorkspaceRenameRequest request) {
        Workspace workspace = getWorkspace(workspaceId);
        workspace.setName(request.name());
        workspace = workspaceRepository.save(workspace);
        return workspaceMapper.mapToGetDTO(workspace, userService.getCurrentUserId());
    }

    @Override
    @WriteTransactional
    @CacheEvict(value = "workspaceMembership", allEntries = true)
    public void deleteWorkspace(Long workspaceId) {
        Long userId = userService.getCurrentUserId();
        WorkspaceMember member = workspaceMembershipService.getWorkspaceMember(workspaceId, userId);

        if (workspaceMembershipService.countMembershipsByUserId(userId) <= 1) {
            throw new ExenceException(ErrorCode.WORKSPACE_CANNOT_DELETE_LAST);
        }

        workspaceRepository.delete(member.getWorkspace());
    }

    @Override
    @WriteTransactional
    public WorkspaceMemberGetDTO addMember(Long workspaceId, WorkspaceMemberEmailRequest request) {
        Workspace workspace = getWorkspace(workspaceId);

        if (workspaceMembershipService.hasMemberByEmail(workspaceId, request.email())) {
            throw new ExenceException(ErrorCode.WORKSPACE_MEMBER_ALREADY_EXISTS);
        }

        User newMemberUser = userService.getUserByEmail(request.email());

        WorkspaceMember member = workspaceMembershipService.addMember(workspace, newMemberUser, WorkspaceRole.MEMBER);
        return workspaceMapper.mapMemberToGetDTO(member);
    }

    @Override
    @ReadTransactional
    public List<WorkspaceMemberGetDTO> getMembers(Long workspaceId) {
        return workspaceMembershipService.getWorkspaceMembers(workspaceId).stream()
                .map(workspaceMapper::mapMemberToGetDTO)
                .toList();
    }

    @Override
    @WriteTransactional
    @CacheEvict(value = "workspaceMembership", key = "@userServiceImpl.getCurrentUserId() + ':' + #workspaceId")
    public void removeSelf(Long workspaceId) {
        Long userId = userService.getCurrentUserId();
        WorkspaceMember member = workspaceMembershipService.getWorkspaceMember(workspaceId, userId);

        if (member.getRole() == WorkspaceRole.OWNER) {
            throw new ExenceException(ErrorCode.WORKSPACE_OWNER_CANNOT_LEAVE);
        }

        workspaceMembershipService.removeMember(member);
    }

    @Override
    @WriteTransactional
    public void removeMemberByEmail(Long workspaceId, WorkspaceMemberEmailRequest request) {
        WorkspaceMember member = workspaceMembershipService.getWorkspaceMemberByEmail(workspaceId, request.email());

        if (member.getRole() == WorkspaceRole.OWNER) {
            throw new ExenceException(ErrorCode.WORKSPACE_OWNER_CANNOT_BE_REMOVED);
        }

        workspaceMembershipService.removeMember(member);
    }
}
