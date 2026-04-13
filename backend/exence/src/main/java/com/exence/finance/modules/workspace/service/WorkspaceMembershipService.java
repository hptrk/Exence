package com.exence.finance.modules.workspace.service;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import java.util.List;

public interface WorkspaceMembershipService {

    /**
     * Validates that the given user is a member of the given workspace.
     * Throws WORKSPACE_NOT_FOUND (403) if not a member. Result is cached.
     */
    void validateMembership(Long userId, Long workspaceId);

    /**
     * Creates a new workspace with the given name, assigns the user as OWNER,
     * and creates default WorkspaceSettings with the given base currency.
     */
    Workspace createDefaultWorkspace(User user, String workspaceName, SupportedCurrency baseCurrency);

    WorkspaceMember getWorkspaceMember(Long workspaceId, Long userId);

    WorkspaceMember getWorkspaceMemberByEmail(Long workspaceId, String email);

    boolean hasMemberByEmail(Long workspaceId, String email);

    long countMembershipsByUserId(Long userId);

    List<WorkspaceMember> getWorkspaceMembers(Long workspaceId);

    WorkspaceMember addMember(Workspace workspace, User user, WorkspaceRole role);

    void removeMember(WorkspaceMember member);

    /**
     * Returns a JPA proxy reference for the current workspace (no DB hit).
     * Throws WORKSPACE_HEADER_MISSING if no workspace is set in context.
     */
    Workspace getWorkspaceReference();
}
