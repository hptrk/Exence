package com.exence.finance.modules.systemsettings.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.modules.systemsettings.controller.impl.AdminSystemSettingsControllerImpl;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsPatchRequest;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsResponse;
import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import com.exence.finance.modules.systemsettings.mapper.SystemSettingsMapper;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(AdminSystemSettingsControllerImpl.class)
class AdminSystemSettingsControllerTest extends BaseControllerTest {

    @MockitoBean
    private SystemSettingsMapper systemSettingsMapper;

    // --- GET /api/admin/settings ---

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/settings - returns system settings")
    void getSettings() throws Exception {
        // given
        SystemSettings entity = new SystemSettings();
        SystemSettingsResponse response = new SystemSettingsResponse(false, List.of(), true, 15, true, 5);
        given(systemSettingsService.getSettings()).willReturn(entity);
        given(systemSettingsMapper.toResponse(entity)).willReturn(response);

        // when
        ResultActions result = performGetNoWorkspace("/api/admin/settings");

        // then
        result.andExpect(status().isOk());
        SystemSettingsResponse body = fromJson(result, SystemSettingsResponse.class);
        assertThat(body.rateLimitingEnabled()).isTrue();
    }

    @Test
    @DisplayName("GET /api/admin/settings - 401 when unauthenticated")
    void getSettings_unauthenticated_returns401() throws Exception {
        performGetNoWorkspace("/api/admin/settings").andExpect(status().isUnauthorized());
    }

    // --- PATCH /api/admin/settings ---

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("PATCH /api/admin/settings - updates system settings and returns updated response")
    void updateSettings() throws Exception {
        // given
        SystemSettingsPatchRequest request = new SystemSettingsPatchRequest(null, null, null, null, null, null);
        SystemSettingsResponse response = new SystemSettingsResponse(false, List.of(), true, 15, true, 5);
        given(systemSettingsService.updateSettings(request)).willReturn(response);

        // when
        ResultActions result = performPatchNoWorkspace("/api/admin/settings", request);

        // then
        result.andExpect(status().isOk());
        SystemSettingsResponse body = fromJson(result, SystemSettingsResponse.class);
        assertThat(body.passwordHistoryCount()).isEqualTo(5);
    }
}
