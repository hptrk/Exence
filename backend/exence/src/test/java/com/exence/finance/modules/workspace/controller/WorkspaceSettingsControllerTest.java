package com.exence.finance.modules.workspace.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.fixtures.WorkspaceTestFixtures;
import com.exence.finance.modules.workspace.controller.impl.WorkspaceSettingsControllerImpl;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsPatchRequest;
import com.exence.finance.modules.workspace.service.WorkspaceSettingsService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(WorkspaceSettingsControllerImpl.class)
class WorkspaceSettingsControllerTest extends BaseControllerTest {

    @MockitoBean
    private WorkspaceSettingsService workspaceSettingsService;

    // --- GET /api/workspaces/settings ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/workspaces/settings - returns workspace settings")
    void getWorkspaceSettings() throws Exception {
        // given
        WorkspaceSettingsGetDTO dto = WorkspaceTestFixtures.settingsGetDTO();
        given(workspaceSettingsService.getWorkspaceSettings()).willReturn(dto);

        // when
        ResultActions result = performGet("/api/workspaces/settings");

        // then
        result.andExpect(status().isOk());
        WorkspaceSettingsGetDTO body = fromJson(result, WorkspaceSettingsGetDTO.class);
        assertThat(body).usingRecursiveComparison().isEqualTo(dto);
    }

    @Test
    @DisplayName("GET /api/workspaces/settings - 401 when unauthenticated")
    void getWorkspaceSettings_unauthenticated_returns401() throws Exception {
        performGet("/api/workspaces/settings").andExpect(status().isUnauthorized());
    }

    // --- PATCH /api/workspaces/settings ---

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/workspaces/settings - updates workspace settings and returns updated DTO")
    void updateWorkspaceSettings() throws Exception {
        // given
        WorkspaceSettingsPatchRequest request = WorkspaceTestFixtures.settingsPatchRequest();
        WorkspaceSettingsGetDTO updated = WorkspaceTestFixtures.settingsGetDTO();
        given(workspaceSettingsService.updateWorkspaceSettings(request)).willReturn(updated);

        // when
        ResultActions result = performPatch("/api/workspaces/settings", request);

        // then
        result.andExpect(status().isOk());
        WorkspaceSettingsGetDTO body = fromJson(result, WorkspaceSettingsGetDTO.class);
        assertThat(body).usingRecursiveComparison().isEqualTo(updated);
    }
}
