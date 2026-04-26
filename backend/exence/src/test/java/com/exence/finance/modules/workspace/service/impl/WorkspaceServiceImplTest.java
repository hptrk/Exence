package com.exence.finance.modules.workspace.service.impl;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willDoNothing;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.common.fixtures.WorkspaceTestFixtures;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.statistics.service.WidgetService;
import com.exence.finance.modules.workspace.dto.WorkspaceCreateRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import com.exence.finance.modules.workspace.mapper.WorkspaceMapper;
import com.exence.finance.modules.workspace.repository.WorkspaceRepository;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WorkspaceServiceImplTest {

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private WorkspaceMembershipService workspaceMembershipService;

    @Mock
    private WorkspaceMapper workspaceMapper;

    @Mock
    private UserService userService;

    @Mock
    private WidgetService widgetService;

    @InjectMocks
    private WorkspaceServiceImpl workspaceService;

    @Test
    @DisplayName("throws WORKSPACE_CANNOT_DELETE_LAST when user has only one workspace")
    void delete_lastWorkspace() {
        // given
        User user = UserTestFixtures.defaultUser();
        Workspace workspace = WorkspaceTestFixtures.workspaceWithOwner(user);
        WorkspaceMember ownerMember = workspace.getMembers().get(0);

        given(userService.getCurrentUserId()).willReturn(user.getId());
        given(workspaceMembershipService.getWorkspaceMember(workspace.getId(), user.getId()))
                .willReturn(ownerMember);
        given(workspaceMembershipService.countMembershipsByUserId(user.getId())).willReturn(1L);

        // when / then
        assertThatThrownBy(() -> workspaceService.deleteWorkspace(workspace.getId()))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.WORKSPACE_CANNOT_DELETE_LAST);
    }

    @Test
    @DisplayName("deletes workspace when user has more than one workspace")
    void delete_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        Workspace workspace = WorkspaceTestFixtures.workspaceWithOwner(user);
        WorkspaceMember ownerMember = workspace.getMembers().get(0);

        given(userService.getCurrentUserId()).willReturn(user.getId());
        given(workspaceMembershipService.getWorkspaceMember(workspace.getId(), user.getId()))
                .willReturn(ownerMember);
        given(workspaceMembershipService.countMembershipsByUserId(user.getId())).willReturn(2L);

        // when
        workspaceService.deleteWorkspace(workspace.getId());

        // then
        then(workspaceRepository).should().delete(workspace);
    }

    @Test
    @DisplayName("throws WORKSPACE_MEMBER_ALREADY_EXISTS when member is already in workspace")
    void addMember_duplicate() {
        // given
        Workspace workspace = WorkspaceTestFixtures.defaultWorkspace();
        WorkspaceMemberEmailRequest request = new WorkspaceMemberEmailRequest("existing@example.com");

        given(workspaceRepository.findById(workspace.getId())).willReturn(Optional.of(workspace));
        given(workspaceMembershipService.hasMemberByEmail(workspace.getId(), request.email()))
                .willReturn(true);

        // when / then
        assertThatThrownBy(() -> workspaceService.addMember(workspace.getId(), request))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.WORKSPACE_MEMBER_ALREADY_EXISTS);
    }

    @Test
    @DisplayName("throws WORKSPACE_OWNER_CANNOT_BE_REMOVED when trying to remove owner")
    void removeMember_ownerEmail() {
        // given
        User owner = UserTestFixtures.defaultUser();
        Workspace workspace = WorkspaceTestFixtures.workspaceWithOwner(owner);
        WorkspaceMember ownerMember = workspace.getMembers().get(0);
        WorkspaceMemberEmailRequest request = new WorkspaceMemberEmailRequest(owner.getEmail());

        given(workspaceMembershipService.getWorkspaceMemberByEmail(workspace.getId(), owner.getEmail()))
                .willReturn(ownerMember);

        // when / then
        assertThatThrownBy(() -> workspaceService.removeMemberByEmail(workspace.getId(), request))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.WORKSPACE_OWNER_CANNOT_BE_REMOVED);
    }

    @Test
    @DisplayName("removes membership when member is not the owner")
    void removeMember_valid() {
        // given
        User owner = UserTestFixtures.defaultUser();
        Workspace workspace = WorkspaceTestFixtures.workspaceWithOwner(owner);
        WorkspaceMember regularMember = WorkspaceMember.builder()
                .id(2L)
                .user(UserTestFixtures.unverifiedUser())
                .workspace(workspace)
                .role(WorkspaceRole.MEMBER)
                .build();
        WorkspaceMemberEmailRequest request = new WorkspaceMemberEmailRequest("unverified@example.com");

        given(workspaceMembershipService.getWorkspaceMemberByEmail(workspace.getId(), request.email()))
                .willReturn(regularMember);
        willDoNothing().given(workspaceMembershipService).removeMember(regularMember);

        // when
        workspaceService.removeMemberByEmail(workspace.getId(), request);

        // then
        then(workspaceMembershipService).should().removeMember(regularMember);
    }

    @Test
    @DisplayName("creates workspace with membership and default widgets")
    void create_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        Workspace workspace = WorkspaceTestFixtures.defaultWorkspace();

        given(userService.getCurrentUser()).willReturn(user);
        given(workspaceMembershipService.createDefaultWorkspace(eq(user), any(), any()))
                .willReturn(workspace);
        given(workspaceMapper.mapToGetDTO(eq(workspace), eq(user.getId()))).willReturn(null);

        // when
        workspaceService.createWorkspace(new WorkspaceCreateRequest("New Workspace", SupportedCurrency.EUR));

        // then
        then(widgetService).should().createDefaultDashboardWidget(workspace);
        then(workspaceMembershipService).should().createDefaultWorkspace(eq(user), any(), any());
    }
}
