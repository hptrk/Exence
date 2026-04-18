package com.exence.finance.common.fixtures;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import com.exence.finance.modules.auth.dto.Theme;
import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.exence.finance.modules.auth.dto.UserPatchDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.dto.response.TokenPair;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;
import com.exence.finance.modules.auth.entity.Role;
import java.time.Instant;
import java.util.List;

public final class AuthTestFixtures {

    private AuthTestFixtures() {}

    public static RegisterRequest registerRequest() {
        return new RegisterRequest(
                "TestUser",
                "testuser@example.com",
                "Password123!",
                "Password123!",
                SupportedCurrency.HUF,
                "Test Workspace");
    }

    public static LoginRequest loginRequest() {
        return new LoginRequest("testuser@example.com", "Password123!");
    }

    public static UserGetDTO userGetDTO() {
        return new UserGetDTO(1L, "TestUser", "testuser@example.com", true, Role.USER);
    }

    public static AuthenticationResponse authResponse() {
        return new AuthenticationResponse(userGetDTO(), new TokenPair("access-token", "refresh-token"), 1L);
    }

    public static UserPatchDTO patchRequest() {
        return new UserPatchDTO("UpdatedUser");
    }

    public static ChangePasswordRequest changePasswordRequest() {
        return new ChangePasswordRequest("Password123!", "NewPassword456!", "NewPassword456!");
    }

    public static UserSettingsResponse settingsResponse() {
        return new UserSettingsResponse("en", Theme.DARK, Theme.LIGHT, SupportedCurrency.HUF, false);
    }

    public static UpdateUserSettingsRequest updateSettingsRequest() {
        return new UpdateUserSettingsRequest("en", Theme.DARK, Theme.LIGHT, SupportedCurrency.EUR, true);
    }

    public static DeviceSessionDTO deviceSessionDTO(String sessionId) {
        return new DeviceSessionDTO(
                sessionId, "Chrome", "Chrome 120", "Windows 11", "127.0.0.1", Instant.now(), Instant.now(), true);
    }

    public static List<DeviceSessionDTO> sessionList() {
        return List.of(deviceSessionDTO("session-1"), deviceSessionDTO("session-2"));
    }
}
