package com.exence.finance.modules.statistics.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.modules.statistics.controller.impl.AdminWidgetControllerImpl;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.service.AdminWidgetService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(AdminWidgetControllerImpl.class)
class AdminWidgetControllerTest extends BaseControllerTest {

    @MockitoBean
    private AdminWidgetService adminWidgetService;

    // --- GET /api/admin/statistics/{type} ---

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/statistics/{type} - returns admin widget data")
    void getWidgetData() throws Exception {
        // given
        AdminWidgetDataResponse response = new AdminWidgetDataResponse(null);
        given(adminWidgetService.getWidgetData(any(), any())).willReturn(response);

        // when
        ResultActions result = performGet("/api/admin/statistics/{type}", AdminWidgetType.DAILY_ACTIVE_USERS);

        // then
        result.andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/admin/statistics/{type} - 401 when unauthenticated")
    void getWidgetData_unauthenticated_returns401() throws Exception {
        performGet("/api/admin/statistics/{type}", AdminWidgetType.DAILY_ACTIVE_USERS)
                .andExpect(status().isUnauthorized());
    }
}
