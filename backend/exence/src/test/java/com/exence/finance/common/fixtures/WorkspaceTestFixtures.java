package com.exence.finance.common.fixtures;

import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import java.util.ArrayList;
import java.util.List;

public final class WorkspaceTestFixtures {

    private WorkspaceTestFixtures() {}

    public static Workspace defaultWorkspace() {
        return Workspace.builder()
                .id(1L)
                .name("My Workspace")
                .members(new ArrayList<>())
                .build();
    }

    public static Workspace workspaceWithOwner(User owner) {
        Workspace workspace = defaultWorkspace();
        WorkspaceMember member = WorkspaceMember.builder()
                .id(1L)
                .user(owner)
                .workspace(workspace)
                .role(WorkspaceRole.OWNER)
                .build();
        workspace.setMembers(new ArrayList<>(List.of(member)));
        return workspace;
    }
}
