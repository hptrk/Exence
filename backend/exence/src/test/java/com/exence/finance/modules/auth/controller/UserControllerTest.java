package com.exence.finance.modules.auth.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.fixtures.AuthTestFixtures;
import com.exence.finance.modules.auth.controller.impl.UserControllerImpl;
import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.exence.finance.modules.auth.dto.UserPatchDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import com.exence.finance.modules.auth.entity.Role;
import com.exence.finance.modules.auth.service.UserService;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(UserControllerImpl.class)
class UserControllerTest extends BaseControllerTest {

    @MockitoBean
    private UserService userService;

    // --- GET /api/user/me ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/user/me - returns current user")
    void getMe() throws Exception {
        // given
        UserGetDTO dto = AuthTestFixtures.userGetDTO();
        given(userService.getUserFromToken()).willReturn(dto);

        // when
        ResultActions result = performGet("/api/user/me");

        // then
        result.andExpect(status().isOk());
        UserGetDTO body = fromJson(result, UserGetDTO.class);
        assertThat(body).usingRecursiveComparison().isEqualTo(dto);
    }

    @Test
    @DisplayName("GET /api/user/me - 401 when unauthenticated")
    void getMe_unauthenticated_returns401() throws Exception {
        performGet("/api/user/me").andExpect(status().isUnauthorized());
    }

    // --- PATCH /api/user ---

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/user - updates username and returns updated user")
    void updateUser() throws Exception {
        // given
        UserPatchDTO request = AuthTestFixtures.patchRequest();
        UserGetDTO updated = new UserGetDTO(1L, "UpdatedUser", "testuser@example.com", true, Role.USER);
        given(userService.updateUser(request)).willReturn(updated);

        // when
        ResultActions result = performPatch("/api/user", request);

        // then
        result.andExpect(status().isOk());
        UserGetDTO body = fromJson(result, UserGetDTO.class);
        assertThat(body.username()).isEqualTo("UpdatedUser");
    }

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/user - 400 when username is invalid")
    void updateUser_invalidUsername_returns400() throws Exception {
        // given — username with only spaces is invalid for @ValidUsername
        UserPatchDTO request = new UserPatchDTO("   ");

        // when
        ResultActions result = performPatch("/api/user", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("username");
    }

    // --- PUT /api/user/password ---

    @Test
    @WithMockUser
    @DisplayName("PUT /api/user/password - changes password and returns 204")
    void changePassword() throws Exception {
        // given
        ChangePasswordRequest request = AuthTestFixtures.changePasswordRequest();
        willDoNothing().given(userService).changePassword(request);

        // when / then
        performPut("/api/user/password", request).andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    @DisplayName("PUT /api/user/password - 400 when old password is blank")
    void changePassword_blankOldPassword_returns400() throws Exception {
        // given
        ChangePasswordRequest request = new ChangePasswordRequest("", "NewPassword456!", "NewPassword456!");

        // when
        ResultActions result = performPut("/api/user/password", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("oldPassword");
    }

    @Test
    @WithMockUser
    @DisplayName("PUT /api/user/password - 400 when new passwords do not match")
    void changePassword_passwordMismatch_returns400() throws Exception {
        // given
        ChangePasswordRequest request = new ChangePasswordRequest("Password123!", "NewPassword456!", "DifferentPass1!");

        // when
        ResultActions result = performPut("/api/user/password", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("confirmNewPassword");
    }

    // --- POST /api/user/request-verify-email ---

    @Test
    @WithMockUser
    @DisplayName("POST /api/user/request-verify-email - returns 204")
    void requestVerifyEmail() throws Exception {
        // given
        willDoNothing().given(userService).requestVerifyEmail();

        // when / then
        performPost("/api/user/request-verify-email", null).andExpect(status().isNoContent());
    }

    // --- DELETE /api/user ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/user - deletes account and returns 204")
    void deleteUser() throws Exception {
        // given
        willDoNothing().given(userService).deleteUser();

        // when / then
        performDelete("/api/user").andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/user - 401 when unauthenticated")
    void deleteUser_unauthenticated_returns401() throws Exception {
        performDelete("/api/user").andExpect(status().isUnauthorized());
    }
}
