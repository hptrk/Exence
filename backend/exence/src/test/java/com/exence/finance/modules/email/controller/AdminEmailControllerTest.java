package com.exence.finance.modules.email.controller;

import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.modules.email.controller.impl.AdminEmailControllerImpl;
import com.exence.finance.modules.email.dto.BroadcastEmailRequest;
import com.exence.finance.modules.email.service.AdminEmailService;
import java.util.Map;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(AdminEmailControllerImpl.class)
class AdminEmailControllerTest extends BaseControllerTest {

    @MockitoBean
    private AdminEmailService adminEmailService;

    // --- POST /api/admin/email/broadcast ---

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/admin/email/broadcast - sends broadcast email and returns 200")
    void sendBroadcastEmail() throws Exception {
        // given
        BroadcastEmailRequest request = new BroadcastEmailRequest("Test Subject", "<p>Test content</p>");
        willDoNothing().given(adminEmailService).sendBroadcastEmailToAllUsers(request);

        // when / then
        performPostNoWorkspace("/api/admin/email/broadcast", request).andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/admin/email/broadcast - 401 when unauthenticated")
    void sendBroadcastEmail_unauthenticated_returns401() throws Exception {
        BroadcastEmailRequest request = new BroadcastEmailRequest("Subject", "<p>Content</p>");
        performPostNoWorkspace("/api/admin/email/broadcast", request).andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/admin/email/broadcast - 400 when subject is blank")
    void sendBroadcastEmail_blankSubject_returns400() throws Exception {
        // given
        BroadcastEmailRequest request = new BroadcastEmailRequest("", "<p>Content</p>");

        // when
        ResultActions result = performPostNoWorkspace("/api/admin/email/broadcast", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        Assertions.assertThat(errors).containsKey("subject");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/admin/email/broadcast - 400 when htmlContent is blank")
    void sendBroadcastEmail_blankContent_returns400() throws Exception {
        // given
        BroadcastEmailRequest request = new BroadcastEmailRequest("Test Subject", "");

        // when
        ResultActions result = performPostNoWorkspace("/api/admin/email/broadcast", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        Assertions.assertThat(errors).containsKey("htmlContent");
    }
}
