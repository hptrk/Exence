package com.exence.finance.modules.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.CookieService;
import com.exence.finance.modules.auth.service.TokenManagementService;
import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import com.exence.finance.modules.systemsettings.service.SystemSettingsService;
import com.exence.finance.security.JwtService;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseCookie;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

@ExtendWith(MockitoExtension.class)
class LogoutServiceImplTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SystemSettingsService systemSettingsService;

    @Mock
    private TokenManagementService tokenManagementService;

    @Mock
    private CookieService cookieService;

    @InjectMocks
    private LogoutServiceImpl service;

    @Test
    @DisplayName("logout single device")
    void logout_singleDevice() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        User user = UserTestFixtures.defaultUser();

        given(cookieService.extractAccessTokenFromCookie(request)).willReturn("access.token");
        SystemSettings settings =
                SystemSettings.builder().logoutFromAllDevices(false).build();
        given(systemSettingsService.getSettings()).willReturn(settings);
        given(jwtService.extractUsername("access.token")).willReturn("test@example.com");
        given(jwtService.extractJwtId("access.token")).willReturn("jwt-id-123");
        given(userRepository.findByEmail("test@example.com")).willReturn(Optional.of(user));
        given(tokenManagementService.getTokenByJwtId("jwt-id-123"))
                .willReturn(Token.builder()
                        .jwtId("jwt-id-123")
                        .sessionId("current-session")
                        .build());
        given(cookieService.createExpiredAccessTokenCookie())
                .willReturn(ResponseCookie.from("access_token", "").build());
        given(cookieService.createExpiredRefreshTokenCookie())
                .willReturn(ResponseCookie.from("refresh_token", "").build());

        // when
        service.logout(request, response, null);

        // then
        then(tokenManagementService).should().revokeUserTokensBySessionId(user.getId(), "current-session");
        then(cookieService).should().createExpiredAccessTokenCookie();
        then(cookieService).should().createExpiredRefreshTokenCookie();
    }

    @Test
    @DisplayName("logout all devices")
    void logout_allDevices() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        User user = UserTestFixtures.defaultUser();

        given(cookieService.extractAccessTokenFromCookie(request)).willReturn("access.token");
        SystemSettings settings =
                SystemSettings.builder().logoutFromAllDevices(true).build();
        given(systemSettingsService.getSettings()).willReturn(settings);
        given(jwtService.extractUsername("access.token")).willReturn("test@example.com");
        given(jwtService.extractJwtId("access.token")).willReturn("jwt-id-123");
        given(userRepository.findByEmail("test@example.com")).willReturn(Optional.of(user));
        given(cookieService.createExpiredAccessTokenCookie())
                .willReturn(ResponseCookie.from("access_token", "").build());
        given(cookieService.createExpiredRefreshTokenCookie())
                .willReturn(ResponseCookie.from("refresh_token", "").build());

        // when
        service.logout(request, response, null);

        // then
        then(tokenManagementService).should().revokeUserTokensByTypes(any(), any());
    }

    @Test
    @DisplayName("logout null token")
    void logout_nullToken() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        given(cookieService.extractAccessTokenFromCookie(request)).willReturn(null);
        given(cookieService.createExpiredAccessTokenCookie())
                .willReturn(ResponseCookie.from("access_token", "").build());
        given(cookieService.createExpiredRefreshTokenCookie())
                .willReturn(ResponseCookie.from("refresh_token", "").build());

        // when / then
        assertThatThrownBy(() -> service.logout(request, response, null))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.AUTHENTICATION_FAILED);
        then(cookieService).should().createExpiredAccessTokenCookie();
        then(cookieService).should().createExpiredRefreshTokenCookie();
    }
}
