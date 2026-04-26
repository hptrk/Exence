package com.exence.finance.modules.workspace.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.common.fixtures.WorkspaceTestFixtures;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.entity.WorkspaceSettings;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import com.exence.finance.modules.workspace.repository.WorkspaceMemberRepository;
import com.exence.finance.modules.workspace.repository.WorkspaceRepository;
import com.exence.finance.modules.workspace.repository.WorkspaceSettingsRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WorkspaceMembershipServiceImplTest {

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Mock
    private WorkspaceSettingsRepository workspaceSettingsRepository;

    @InjectMocks
    private WorkspaceMembershipServiceImpl service;

    @Test
    @DisplayName("validate membership valid")
    void validateMembership_valid() {
        // given
        given(workspaceMemberRepository.existsByWorkspaceIdAndUserId(1L, 1L)).willReturn(true);

        // when / then
        assertThatNoException().isThrownBy(() -> service.validateMembership(1L, 1L));
    }

    @Test
    @DisplayName("validate membership non member")
    void validateMembership_nonMember() {
        // given
        given(workspaceMemberRepository.existsByWorkspaceIdAndUserId(1L, 99L)).willReturn(false);

        // when / then
        assertThatThrownBy(() -> service.validateMembership(99L, 1L))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.WORKSPACE_NOT_FOUND);
    }

    @Test
    @DisplayName("create default workspace valid")
    void createDefaultWorkspace_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        Workspace workspace = WorkspaceTestFixtures.defaultWorkspace();

        given(workspaceRepository.save(any(Workspace.class))).willReturn(workspace);
        given(workspaceMemberRepository.save(any(WorkspaceMember.class)))
                .willReturn(WorkspaceMember.builder().build());
        given(workspaceSettingsRepository.save(any(WorkspaceSettings.class)))
                .willReturn(WorkspaceSettings.builder().build());

        // when
        Workspace result = service.createDefaultWorkspace(user, "Test Workspace", SupportedCurrency.EUR);

        // then
        assertThat(result).isNotNull();
        then(workspaceRepository).should().save(any(Workspace.class));
        then(workspaceMemberRepository).should().save(any(WorkspaceMember.class));
        then(workspaceSettingsRepository).should().save(any(WorkspaceSettings.class));
    }

    @Test
    @DisplayName("get workspace member valid")
    void getWorkspaceMember_valid() {
        // given
        WorkspaceMember member = WorkspaceMember.builder().id(1L).build();
        given(workspaceMemberRepository.findByWorkspaceIdAndUserId(1L, 1L)).willReturn(Optional.of(member));

        // when
        WorkspaceMember result = service.getWorkspaceMember(1L, 1L);

        // then
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("get workspace member not found")
    void getWorkspaceMember_notFound() {
        // given
        given(workspaceMemberRepository.findByWorkspaceIdAndUserId(1L, 99L)).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> service.getWorkspaceMember(1L, 99L))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.WORKSPACE_NOT_FOUND);
    }

    @Test
    @DisplayName("add member valid")
    void addMember_valid() {
        // given
        User user = UserTestFixtures.defaultUser();
        Workspace workspace = WorkspaceTestFixtures.defaultWorkspace();
        WorkspaceMember savedMember = WorkspaceMember.builder().id(2L).build();
        given(workspaceMemberRepository.save(any(WorkspaceMember.class))).willReturn(savedMember);

        // when
        WorkspaceMember result = service.addMember(workspace, user, WorkspaceRole.MEMBER);

        // then
        assertThat(result.getId()).isEqualTo(2L);
    }

    @Test
    @DisplayName("remove member valid")
    void removeMember_valid() {
        // given
        WorkspaceMember member = WorkspaceMember.builder().id(1L).build();

        // when
        service.removeMember(member);

        // then
        then(workspaceMemberRepository).should().delete(member);
    }

    @Test
    @DisplayName("has member by email existing")
    void hasMemberByEmail_existing() {
        // given
        WorkspaceMember member = WorkspaceMember.builder().id(1L).build();
        given(workspaceMemberRepository.findByWorkspaceIdAndUserEmail(1L, "test@example.com"))
                .willReturn(Optional.of(member));

        // when
        boolean result = service.hasMemberByEmail(1L, "test@example.com");

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("get workspace members")
    void getWorkspaceMembers_valid() {
        // given
        WorkspaceMember member = WorkspaceMember.builder().id(1L).build();
        given(workspaceMemberRepository.findAllByWorkspaceId(1L)).willReturn(List.of(member));

        // when
        List<WorkspaceMember> result = service.getWorkspaceMembers(1L);

        // then
        assertThat(result).hasSize(1);
    }
}
