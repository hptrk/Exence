package com.exence.finance.modules.auth.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.fixtures.AuthTestFixtures;
import com.exence.finance.modules.auth.controller.impl.UserSettingsControllerImpl;
import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;
import com.exence.finance.modules.auth.service.UserSettingsService;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(UserSettingsControllerImpl.class)
class UserSettingsControllerTest extends BaseControllerTest {

    @MockitoBean
    private UserSettingsService userSettingsService;

    // --- GET /api/user/settings ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/user/settings - returns current user settings")
    void getSettings() throws Exception {
        // given
        UserSettingsResponse response = AuthTestFixtures.settingsResponse();
        given(userSettingsService.getCurrentUserSettings()).willReturn(response);

        // when
        ResultActions result = performGet("/api/user/settings");

        // then
        result.andExpect(status().isOk());
        UserSettingsResponse body = fromJson(result, UserSettingsResponse.class);
        assertThat(body).usingRecursiveComparison().isEqualTo(response);
    }

    @Test
    @DisplayName("GET /api/user/settings - 401 when unauthenticated")
    void getSettings_unauthenticated_returns401() throws Exception {
        performGet("/api/user/settings").andExpect(status().isUnauthorized());
    }

    // --- PATCH /api/user/settings ---

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/user/settings - updates settings and returns updated response")
    void updateSettings() throws Exception {
        // given
        UpdateUserSettingsRequest request = AuthTestFixtures.updateSettingsRequest();
        UserSettingsResponse response = AuthTestFixtures.settingsResponse();
        given(userSettingsService.updateCurrentUserSettings(request)).willReturn(response);

        // when
        ResultActions result = performPatch("/api/user/settings", request);

        // then
        result.andExpect(status().isOk());
        UserSettingsResponse body = fromJson(result, UserSettingsResponse.class);
        assertThat(body).usingRecursiveComparison().isEqualTo(response);
    }

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/user/settings - 400 when language code is invalid")
    void updateSettings_invalidLanguage_returns400() throws Exception {
        // given
        UpdateUserSettingsRequest request = new UpdateUserSettingsRequest("zz", null, null, null, null);

        // when
        ResultActions result = performPatch("/api/user/settings", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("language");
    }
}
