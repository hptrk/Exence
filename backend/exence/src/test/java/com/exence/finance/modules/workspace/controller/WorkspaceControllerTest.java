package com.exence.finance.modules.workspace.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.fixtures.WorkspaceTestFixtures;
import com.exence.finance.modules.workspace.controller.impl.WorkspaceControllerImpl;
import com.exence.finance.modules.workspace.dto.WorkspaceCreateRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceRenameRequest;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import com.exence.finance.modules.workspace.service.WorkspaceService;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(WorkspaceControllerImpl.class)
class WorkspaceControllerTest extends BaseControllerTest {

    @MockitoBean
    private WorkspaceService workspaceService;

    // --- POST /api/workspaces ---

    @Test
    @WithMockUser
    @DisplayName("POST /api/workspaces - creates workspace and returns it")
    void createWorkspace() throws Exception {
        // given
        WorkspaceCreateRequest request = WorkspaceTestFixtures.createRequest();
        WorkspaceGetDTO response = WorkspaceTestFixtures.getDTO();
        given(workspaceService.createWorkspace(request)).willReturn(response);

        // when
        ResultActions result = performPost("/api/workspaces", request);

        // then
        result.andExpect(status().isOk());
        WorkspaceGetDTO body = fromJson(result, WorkspaceGetDTO.class);
        assertThat(body.name()).isEqualTo("My Workspace");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/workspaces - 400 when name is blank")
    void createWorkspace_blankName_returns400() throws Exception {
        // given
        WorkspaceCreateRequest request =
                new WorkspaceCreateRequest("", SupportedCurrency.HUF);

        // when
        ResultActions result = performPost("/api/workspaces", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("name");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/workspaces - 400 when baseCurrency is null")
    void createWorkspace_nullCurrency_returns400() throws Exception {
        // given
        WorkspaceCreateRequest request = new WorkspaceCreateRequest("My Workspace", null);

        // when
        ResultActions result = performPost("/api/workspaces", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("baseCurrency");
    }

    // --- GET /api/workspaces ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/workspaces - returns list of user workspaces")
    void getMyWorkspaces() throws Exception {
        // given
        List<WorkspaceGetDTO> workspaces = List.of(WorkspaceTestFixtures.getDTO());
        given(workspaceService.getMyWorkspaces()).willReturn(workspaces);

        // when
        ResultActions result = performGet("/api/workspaces");

        // then
        result.andExpect(status().isOk());
        List<WorkspaceGetDTO> body = fromJson(result, new TypeReference<>() {});
        assertThat(body).hasSize(1);
    }

    @Test
    @DisplayName("GET /api/workspaces - 401 when unauthenticated")
    void getMyWorkspaces_unauthenticated_returns401() throws Exception {
        performGet("/api/workspaces").andExpect(status().isUnauthorized());
    }

    // --- PATCH /api/workspaces/{workspaceId} ---

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/workspaces/{id} - renames workspace and returns updated DTO")
    void renameWorkspace() throws Exception {
        // given
        WorkspaceRenameRequest request = WorkspaceTestFixtures.renameRequest();
        WorkspaceGetDTO updated = new WorkspaceGetDTO(
                1L, "Renamed Workspace", WorkspaceRole.OWNER);
        given(workspaceService.renameWorkspace(1L, request)).willReturn(updated);

        // when
        ResultActions result = performPatch("/api/workspaces/{id}", request, 1L);

        // then
        result.andExpect(status().isOk());
        WorkspaceGetDTO body = fromJson(result, WorkspaceGetDTO.class);
        assertThat(body.name()).isEqualTo("Renamed Workspace");
    }

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/workspaces/{id} - 400 when name is blank")
    void renameWorkspace_blankName_returns400() throws Exception {
        // given
        WorkspaceRenameRequest request = new WorkspaceRenameRequest("");

        // when
        ResultActions result = performPatch("/api/workspaces/{id}", request, 1L);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("name");
    }

    // --- DELETE /api/workspaces/{workspaceId} ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/workspaces/{id} - deletes workspace and returns 204")
    void deleteWorkspace() throws Exception {
        // given
        willDoNothing().given(workspaceService).deleteWorkspace(1L);

        // when / then
        performDelete("/api/workspaces/{id}", 1L).andExpect(status().isNoContent());
    }

    // --- POST /api/workspaces/{workspaceId}/members ---

    @Test
    @WithMockUser
    @DisplayName("POST /api/workspaces/{id}/members - adds member and returns member DTO")
    void addMember() throws Exception {
        // given
        WorkspaceMemberEmailRequest request = WorkspaceTestFixtures.memberEmailRequest("member@example.com");
        WorkspaceMemberGetDTO response = WorkspaceTestFixtures.memberGetDTO(2L);
        given(workspaceService.addMember(1L, request)).willReturn(response);

        // when
        ResultActions result = performPost("/api/workspaces/1/members", request);

        // then
        result.andExpect(status().isOk());
        WorkspaceMemberGetDTO body = fromJson(result, WorkspaceMemberGetDTO.class);
        assertThat(body.userId()).isEqualTo(2L);
    }

    // --- GET /api/workspaces/{workspaceId}/members ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/workspaces/{id}/members - returns workspace members")
    void getMembers() throws Exception {
        // given
        List<WorkspaceMemberGetDTO> members = List.of(WorkspaceTestFixtures.memberGetDTO(1L));
        given(workspaceService.getMembers(1L)).willReturn(members);

        // when
        ResultActions result = performGet("/api/workspaces/{id}/members", 1L);

        // then
        result.andExpect(status().isOk());
        List<WorkspaceMemberGetDTO> body = fromJson(result, new TypeReference<>() {});
        assertThat(body).hasSize(1);
    }

    // --- DELETE /api/workspaces/{workspaceId}/members/me ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/workspaces/{id}/members/me - leaves workspace and returns 204")
    void removeSelf() throws Exception {
        // given
        willDoNothing().given(workspaceService).removeSelf(1L);

        // when / then
        performDelete("/api/workspaces/{id}/members/me", 1L).andExpect(status().isNoContent());
    }

    // --- DELETE /api/workspaces/{workspaceId}/members ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/workspaces/{id}/members - removes member by email and returns 204")
    void removeMemberByEmail() throws Exception {
        // given
        WorkspaceMemberEmailRequest request = WorkspaceTestFixtures.memberEmailRequest("member@example.com");
        willDoNothing().given(workspaceService).removeMemberByEmail(1L, request);

        // when / then
        performDeleteWithBody("/api/workspaces/{id}/members", request, 1L)
                .andExpect(status().isNoContent());
    }
}
