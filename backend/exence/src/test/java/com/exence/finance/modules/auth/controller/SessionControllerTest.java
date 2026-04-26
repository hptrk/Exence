package com.exence.finance.modules.auth.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.fixtures.AuthTestFixtures;
import com.exence.finance.modules.auth.controller.impl.SessionControllerImpl;
import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import com.exence.finance.modules.auth.service.SessionService;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(SessionControllerImpl.class)
class SessionControllerTest extends BaseControllerTest {

    @MockitoBean
    private SessionService sessionService;

    // --- GET /api/sessions ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/sessions - returns list of active sessions")
    void getActiveSessions() throws Exception {
        // given
        List<DeviceSessionDTO> sessions = AuthTestFixtures.sessionList();
        given(sessionService.getActiveSessions()).willReturn(sessions);

        // when
        ResultActions result = performGetNoWorkspace("/api/sessions");

        // then
        result.andExpect(status().isOk());
        List<DeviceSessionDTO> body = fromJson(result, new TypeReference<>() {});
        assertThat(body).hasSize(2);
    }

    @Test
    @DisplayName("GET /api/sessions - 401 when unauthenticated")
    void getActiveSessions_unauthenticated_returns401() throws Exception {
        performGetNoWorkspace("/api/sessions").andExpect(status().isUnauthorized());
    }

    // --- DELETE /api/sessions/{sessionId} ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/sessions/{sessionId} - revokes session and returns 204")
    void revokeSession() throws Exception {
        // given
        willDoNothing().given(sessionService).revokeSession("session-1");

        // when / then
        performDeleteNoWorkspace("/api/sessions/{id}", "session-1").andExpect(status().isNoContent());
    }

    // --- DELETE /api/sessions/others ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/sessions/others - revokes all other sessions and returns 204")
    void revokeOtherSessions() throws Exception {
        // given
        willDoNothing().given(sessionService).revokeAllOtherSessions();

        // when / then
        performDeleteNoWorkspace("/api/sessions/others").andExpect(status().isNoContent());
    }
}
