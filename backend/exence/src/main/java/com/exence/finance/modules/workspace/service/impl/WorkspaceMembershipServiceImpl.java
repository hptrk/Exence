package com.exence.finance.modules.workspace.service.impl;

import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.entity.WorkspaceSettings;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import com.exence.finance.modules.workspace.repository.WorkspaceMemberRepository;
import com.exence.finance.modules.workspace.repository.WorkspaceRepository;
import com.exence.finance.modules.workspace.repository.WorkspaceSettingsRepository;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkspaceMembershipServiceImpl implements WorkspaceMembershipService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final WorkspaceSettingsRepository workspaceSettingsRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Cacheable(value = "workspaceMembership", key = "#userId + ':' + #workspaceId")
    public void validateMembership(Long userId, Long workspaceId) {
        if (!workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, userId)) {
            throw new ExenceException(ErrorCode.WORKSPACE_NOT_FOUND);
        }
    }

    @Override
    @WriteTransactional
    public Workspace createDefaultWorkspace(User user, String workspaceName, SupportedCurrency baseCurrency) {
        Workspace workspace = Workspace.builder().name(workspaceName).build();
        workspace = workspaceRepository.save(workspace);

        WorkspaceMember owner = WorkspaceMember.builder()
                .workspace(workspace)
                .user(user)
                .role(WorkspaceRole.OWNER)
                .build();
        workspaceMemberRepository.save(owner);
        workspace.setMembers(List.of(owner));

        WorkspaceSettings settings = WorkspaceSettings.builder()
                .workspace(workspace)
                .baseCurrency(baseCurrency)
                .showBaseCurrency(false)
                .build();
        workspaceSettingsRepository.save(settings);
        workspace.setSettings(settings);

        return workspace;
    }

    @Override
    public WorkspaceMember getWorkspaceMember(Long workspaceId, Long userId) {
        return workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> new ExenceException(ErrorCode.WORKSPACE_NOT_FOUND));
    }

    @Override
    public WorkspaceMember getWorkspaceMemberByEmail(Long workspaceId, String email) {
        return workspaceMemberRepository
                .findByWorkspaceIdAndUserEmail(workspaceId, email)
                .orElseThrow(() -> new ExenceException(ErrorCode.WORKSPACE_NOT_FOUND));
    }

    @Override
    public boolean hasMemberByEmail(Long workspaceId, String email) {
        return workspaceMemberRepository
                .findByWorkspaceIdAndUserEmail(workspaceId, email)
                .isPresent();
    }

    @Override
    public long countMembershipsByUserId(Long userId) {
        return workspaceMemberRepository.countByUserId(userId);
    }

    @Override
    public List<WorkspaceMember> getWorkspaceMembers(Long workspaceId) {
        return workspaceMemberRepository.findAllByWorkspaceId(workspaceId);
    }

    @Override
    public WorkspaceMember addMember(Workspace workspace, User user, WorkspaceRole role) {
        WorkspaceMember member = WorkspaceMember.builder()
                .workspace(workspace)
                .user(user)
                .role(role)
                .build();
        return workspaceMemberRepository.save(member);
    }

    @Override
    public void removeMember(WorkspaceMember member) {
        workspaceMemberRepository.delete(member);
    }

    @Override
    public Workspace getWorkspaceReference() {
        Long workspaceId = WorkspaceContextHolder.getWorkspaceId();
        if (workspaceId == null) {
            throw new ExenceException(ErrorCode.WORKSPACE_HEADER_MISSING);
        }
        return entityManager.getReference(Workspace.class, workspaceId);
    }
}
