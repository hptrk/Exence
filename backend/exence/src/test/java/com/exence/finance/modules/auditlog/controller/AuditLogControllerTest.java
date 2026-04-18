package com.exence.finance.modules.auditlog.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.modules.auditlog.controller.impl.AuditLogControllerImpl;
import com.exence.finance.modules.auditlog.service.AuditLogService;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.SliceImpl;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(AuditLogControllerImpl.class)
class AuditLogControllerTest extends BaseControllerTest {

    @MockitoBean
    private AuditLogService auditLogService;

    // --- GET /api/audit-logs ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/audit-logs - returns paginated workspace audit logs")
    void getWorkspaceAuditLogs() throws Exception {
        // given
        given(auditLogService.getWorkspaceAuditLogs(any(), any())).willReturn(new SliceImpl<>(List.of()));

        // when
        ResultActions result = performGet("/api/audit-logs");

        // then
        result.andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/audit-logs - 401 when unauthenticated")
    void getWorkspaceAuditLogs_unauthenticated_returns401() throws Exception {
        performGet("/api/audit-logs").andExpect(status().isUnauthorized());
    }
}
