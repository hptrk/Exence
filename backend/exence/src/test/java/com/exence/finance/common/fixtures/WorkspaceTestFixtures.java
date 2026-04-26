package com.exence.finance.common.fixtures;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.workspace.dto.WorkspaceCreateRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceRenameRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsPatchRequest;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import java.time.Instant;
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

    public static WorkspaceCreateRequest createRequest() {
        return new WorkspaceCreateRequest("My Workspace", SupportedCurrency.HUF);
    }

    public static WorkspaceRenameRequest renameRequest() {
        return new WorkspaceRenameRequest("Renamed Workspace");
    }

    public static WorkspaceMemberEmailRequest memberEmailRequest(String email) {
        return new WorkspaceMemberEmailRequest(email);
    }

    public static WorkspaceGetDTO getDTO() {
        return new WorkspaceGetDTO(1L, "My Workspace", WorkspaceRole.OWNER);
    }

    public static WorkspaceMemberGetDTO memberGetDTO(Long userId) {
        return new WorkspaceMemberGetDTO(userId, "TestUser", "test@example.com", WorkspaceRole.MEMBER, Instant.now());
    }

    public static WorkspaceSettingsGetDTO settingsGetDTO() {
        return new WorkspaceSettingsGetDTO(SupportedCurrency.HUF, false);
    }

    public static WorkspaceSettingsPatchRequest settingsPatchRequest() {
        return new WorkspaceSettingsPatchRequest(SupportedCurrency.EUR, true);
    }
}
