package com.exence.finance.modules.workspace.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsPatchRequest;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.entity.WorkspaceSettings;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import com.exence.finance.modules.workspace.mapper.WorkspaceSettingsMapper;
import com.exence.finance.modules.workspace.repository.WorkspaceSettingsRepository;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

@ExtendWith(MockitoExtension.class)
class WorkspaceSettingsServiceImplTest {

    @Mock
    private WorkspaceSettingsRepository workspaceSettingsRepository;

    @Mock
    private WorkspaceSettingsMapper workspaceSettingsMapper;

    @Mock
    private WorkspaceMembershipService workspaceMembershipService;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private UserService userService;

    @InjectMocks
    private WorkspaceSettingsServiceImpl service;

    @BeforeEach
    void setUp() {
        WorkspaceContextHolder.setWorkspaceId(1L);
    }

    @AfterEach
    void tearDown() {
        WorkspaceContextHolder.clear();
    }

    @Test
    @DisplayName("get workspace settings valid")
    void getWorkspaceSettings_valid() {
        // given
        WorkspaceSettings settings =
                WorkspaceSettings.builder().baseCurrency(SupportedCurrency.EUR).build();
        WorkspaceSettingsGetDTO dto = new WorkspaceSettingsGetDTO(SupportedCurrency.EUR, false);

        given(workspaceSettingsRepository.findByWorkspaceId(1L)).willReturn(Optional.of(settings));
        given(workspaceSettingsMapper.toGetDTO(settings)).willReturn(dto);

        // when
        WorkspaceSettingsGetDTO result = service.getWorkspaceSettings();

        // then
        assertThat(result.baseCurrency()).isEqualTo(SupportedCurrency.EUR);
    }

    @Test
    @DisplayName("update workspace settings owner")
    void updateWorkspaceSettings_owner() {
        // given
        WorkspaceMember ownerMember =
                WorkspaceMember.builder().role(WorkspaceRole.OWNER).build();
        WorkspaceSettings settings =
                WorkspaceSettings.builder().baseCurrency(SupportedCurrency.EUR).build();
        WorkspaceSettingsGetDTO dto = new WorkspaceSettingsGetDTO(SupportedCurrency.HUF, false);
        WorkspaceSettingsPatchRequest request = new WorkspaceSettingsPatchRequest(SupportedCurrency.HUF, null);

        given(userService.getCurrentUserId()).willReturn(1L);
        given(workspaceMembershipService.getWorkspaceMember(1L, 1L)).willReturn(ownerMember);
        given(workspaceSettingsRepository.findByWorkspaceId(1L)).willReturn(Optional.of(settings));
        given(workspaceSettingsRepository.save(settings)).willReturn(settings);
        given(workspaceSettingsMapper.toGetDTO(settings)).willReturn(dto);

        // when
        WorkspaceSettingsGetDTO result = service.updateWorkspaceSettings(request);

        // then
        assertThat(result.baseCurrency()).isEqualTo(SupportedCurrency.HUF);
        then(workspaceSettingsRepository).should().save(settings);
    }

    @Test
    @DisplayName("update workspace settings viewer")
    void updateWorkspaceSettings_viewer() {
        // given
        WorkspaceMember viewerMember =
                WorkspaceMember.builder().role(WorkspaceRole.MEMBER).build();
        WorkspaceSettingsPatchRequest request = new WorkspaceSettingsPatchRequest(SupportedCurrency.USD, null);

        given(userService.getCurrentUserId()).willReturn(2L);
        given(workspaceMembershipService.getWorkspaceMember(1L, 2L)).willReturn(viewerMember);

        // when / then
        assertThatThrownBy(() -> service.updateWorkspaceSettings(request))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.WORKSPACE_OWNER_REQUIRED);
    }
}
