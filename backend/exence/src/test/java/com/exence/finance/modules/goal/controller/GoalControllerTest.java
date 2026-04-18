package com.exence.finance.modules.goal.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.fixtures.GoalTestFixtures;
import com.exence.finance.modules.goal.controller.impl.GoalControllerImpl;
import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.dto.GoalGetDTO;
import com.exence.finance.modules.goal.dto.GoalPatchDTO;
import com.exence.finance.modules.goal.service.GoalService;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.service.GoalWidgetService;
import com.fasterxml.jackson.core.type.TypeReference;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(GoalControllerImpl.class)
class GoalControllerTest extends BaseControllerTest {

    @MockitoBean
    private GoalService goalService;

    @MockitoBean
    private GoalWidgetService goalWidgetService;

    // --- GET /api/goals ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/goals - returns list of goals")
    void getGoals() throws Exception {
        // given
        List<GoalGetDTO> goals = List.of(GoalTestFixtures.getDTO(1L));
        given(goalService.getGoalsByStatuses(any())).willReturn(goals);

        // when
        ResultActions result = performGet("/api/goals");

        // then
        result.andExpect(status().isOk());
        List<GoalGetDTO> body = fromJson(result, new TypeReference<>() {});
        assertThat(body).hasSize(1);
    }

    @Test
    @DisplayName("GET /api/goals - 401 when unauthenticated")
    void getGoals_unauthenticated_returns401() throws Exception {
        performGet("/api/goals").andExpect(status().isUnauthorized());
    }

    // --- GET /api/goals/{id} ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/goals/{id} - returns goal by id")
    void getGoalById() throws Exception {
        // given
        GoalGetDTO dto = GoalTestFixtures.getDTO(1L);
        given(goalService.getGoalById(1L)).willReturn(dto);

        // when
        ResultActions result = performGet("/api/goals/{id}", 1L);

        // then
        result.andExpect(status().isOk());
        GoalGetDTO body = fromJson(result, GoalGetDTO.class);
        assertThat(body).usingRecursiveComparison().isEqualTo(dto);
    }

    // --- POST /api/goals ---

    @Test
    @WithMockUser
    @DisplayName("POST /api/goals - creates goal and returns 201")
    void createGoal() throws Exception {
        // given
        GoalCreateDTO request = GoalTestFixtures.createRequest(1L);
        GoalGetDTO response = GoalTestFixtures.getDTO(1L);
        given(goalService.createGoal(request)).willReturn(response);

        // when
        ResultActions result = performPost("/api/goals", request);

        // then
        result.andExpect(status().isCreated());
        GoalGetDTO body = fromJson(result, GoalGetDTO.class);
        assertThat(body.title()).isEqualTo("Vacation Fund");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/goals - 400 when title is blank")
    void createGoal_blankTitle_returns400() throws Exception {
        // given
        GoalCreateDTO request = new GoalCreateDTO(
                "",
                null,
                new BigDecimal("3000.00"),
                null,
                SupportedCurrency.USD,
                null,
                1L);

        // when
        ResultActions result = performPost("/api/goals", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("title");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/goals - 400 when targetAmount is null")
    void createGoal_nullTargetAmount_returns400() throws Exception {
        // given
        GoalCreateDTO request = new GoalCreateDTO(
                "Vacation Fund", null, null, null, SupportedCurrency.USD, null, 1L);

        // when
        ResultActions result = performPost("/api/goals", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("targetAmount");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/goals - 400 when currency is null")
    void createGoal_nullCurrency_returns400() throws Exception {
        // given
        GoalCreateDTO request =
                new GoalCreateDTO("Vacation Fund", null, new BigDecimal("3000.00"), null, null, null, 1L);

        // when
        ResultActions result = performPost("/api/goals", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("currency");
    }

    @Test
    @DisplayName("POST /api/goals - 401 when unauthenticated")
    void createGoal_unauthenticated_returns401() throws Exception {
        performPost("/api/goals", GoalTestFixtures.createRequest(1L)).andExpect(status().isUnauthorized());
    }

    // --- PATCH /api/goals/{id} ---

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/goals/{id} - updates goal and returns updated DTO")
    void patchGoal() throws Exception {
        // given
        GoalPatchDTO request = GoalTestFixtures.patchRequest();
        GoalGetDTO updated = GoalTestFixtures.getDTO(1L);
        given(goalService.patchGoal(1L, request)).willReturn(updated);

        // when
        ResultActions result = performPatch("/api/goals/{id}", request, 1L);

        // then
        result.andExpect(status().isOk());
        GoalGetDTO body = fromJson(result, GoalGetDTO.class);
        assertThat(body.id()).isEqualTo(1L);
    }

    // --- DELETE /api/goals/{id} ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/goals/{id} - deletes goal and returns 204")
    void deleteGoal() throws Exception {
        // given
        willDoNothing().given(goalService).deleteGoal(1L);

        // when / then
        performDelete("/api/goals/{id}", 1L).andExpect(status().isNoContent());
    }

    // --- GET /api/goals/statistics/{type} ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/goals/statistics/{type} - returns goal widget data")
    void getWidgetData() throws Exception {
        // given
        GoalWidgetDataResponse response = new GoalWidgetDataResponse(null);
        given(goalWidgetService.getWidgetData(GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD, null, null))
                .willReturn(response);

        // when
        ResultActions result = performGet("/api/goals/statistics/{type}", GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD);

        // then
        result.andExpect(status().isOk());
    }
}
