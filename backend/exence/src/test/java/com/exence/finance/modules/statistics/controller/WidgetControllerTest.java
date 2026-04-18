package com.exence.finance.modules.statistics.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.modules.statistics.controller.impl.WidgetControllerImpl;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import com.exence.finance.modules.statistics.dto.WidgetCreateDTO;
import com.exence.finance.modules.statistics.dto.response.WidgetDataResponse;
import com.exence.finance.modules.statistics.dto.response.WidgetLayoutResponse;
import com.exence.finance.modules.statistics.service.WidgetService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(WidgetControllerImpl.class)
class WidgetControllerTest extends BaseControllerTest {

    @MockitoBean
    private WidgetService widgetService;

    // --- GET /api/statistics/widgets/layout ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/statistics/widgets/layout - returns widget layout")
    void getLayout() throws Exception {
        // given
        WidgetLayoutResponse response = new WidgetLayoutResponse(List.of(), List.of());
        given(widgetService.getLayout()).willReturn(response);

        // when
        ResultActions result = performGet("/api/statistics/widgets/layout");

        // then
        result.andExpect(status().isOk());
        WidgetLayoutResponse body = fromJson(result, WidgetLayoutResponse.class);
        assertThat(body.statCards()).isEmpty();
        assertThat(body.charts()).isEmpty();
    }

    @Test
    @DisplayName("GET /api/statistics/widgets/layout - 401 when unauthenticated")
    void getLayout_unauthenticated_returns401() throws Exception {
        performGet("/api/statistics/widgets/layout").andExpect(status().isUnauthorized());
    }

    // --- GET /api/statistics/widgets/{widgetId}/data ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/statistics/widgets/{widgetId}/data - returns widget data")
    void getWidgetData() throws Exception {
        // given
        WidgetDataResponse response = new WidgetDataResponse(1L, null, null);
        given(widgetService.getWidgetData(any(), any())).willReturn(response);

        // when
        ResultActions result = performGet("/api/statistics/widgets/{widgetId}/data", 1L);

        // then
        result.andExpect(status().isOk());
        WidgetDataResponse body = fromJson(result, WidgetDataResponse.class);
        assertThat(body.widgetId()).isEqualTo(1L);
    }

    // --- GET /api/statistics/widgets/dashboard ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/statistics/widgets/dashboard - returns dashboard balance trend")
    void getDashboardBalanceTrend() throws Exception {
        // given
        WidgetDataResponse response = new WidgetDataResponse(null, null, null);
        given(widgetService.getDashboardBalanceTrend(any())).willReturn(response);

        // when
        ResultActions result = performGet("/api/statistics/widgets/dashboard");

        // then
        result.andExpect(status().isOk());
    }

    // --- POST /api/statistics/widgets ---

    @Test
    @WithMockUser
    @DisplayName("POST /api/statistics/widgets - creates widget and returns layout")
    void createWidget() throws Exception {
        // given
        WidgetCreateDTO request =
                new WidgetCreateDTO(StatisticsWidgetType.BALANCE_TREND, null, null, null, 0, 0, 2, 2, null);
        WidgetLayoutResponse response = new WidgetLayoutResponse(List.of(), List.of());
        given(widgetService.createWidget(any())).willReturn(response);

        // when
        ResultActions result = performPost("/api/statistics/widgets", request);

        // then
        result.andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/statistics/widgets - 400 when type is null")
    void createWidget_nullType_returns400() throws Exception {
        // given
        WidgetCreateDTO request = new WidgetCreateDTO(null, null, null, null, null, null, null, null, null);

        // when
        ResultActions result = performPost("/api/statistics/widgets", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("type");
    }

    // --- PUT /api/statistics/widgets/layout ---

    @Test
    @WithMockUser
    @DisplayName("PUT /api/statistics/widgets/layout - updates layout and returns updated layout")
    void updateLayout() throws Exception {
        // given
        UpdateLayoutRequest request = new UpdateLayoutRequest(List.of(), List.of());
        WidgetLayoutResponse response = new WidgetLayoutResponse(List.of(), List.of());
        given(widgetService.updateLayout(request)).willReturn(response);

        // when
        ResultActions result = performPut("/api/statistics/widgets/layout", request);

        // then
        result.andExpect(status().isOk());
    }
}
