package com.exence.finance.modules.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.mapper.SessionMapper;
import com.exence.finance.modules.auth.service.CookieService;
import com.exence.finance.modules.auth.service.RequestContextService;
import com.exence.finance.modules.auth.service.TokenManagementService;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.security.JwtService;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;

@ExtendWith(MockitoExtension.class)
class SessionServiceImplTest {

    @Mock
    private TokenManagementService tokenManagementService;

    @Mock
    private UserService userService;

    @Mock
    private JwtService jwtService;

    @Mock
    private SessionMapper sessionMapper;

    @Mock
    private CookieService cookieService;

    @Mock
    private RequestContextService requestContextService;

    @InjectMocks
    private SessionServiceImpl service;

    @Test
    @DisplayName("get active sessions valid")
    void getActiveSessions_valid() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        given(userService.getCurrentUserId()).willReturn(1L);
        given(tokenManagementService.findActiveSessions(1L)).willReturn(List.of());
        given(requestContextService.getCurrentRequest()).willReturn(request);
        given(cookieService.extractAccessTokenFromCookie(request)).willReturn(null);
        DeviceSessionDTO session = new DeviceSessionDTO("session-1", null, null, null, null, null, null, false);
        given(sessionMapper.mapToDeviceSessionDTOList(any(), any())).willReturn(List.of(session));

        // when
        List<DeviceSessionDTO> result = service.getActiveSessions();

        // then
        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("revoke session valid")
    void revokeSession_valid() {
        // given
        given(userService.getCurrentUserId()).willReturn(1L);

        // when
        service.revokeSession("session-abc");

        // then
        then(tokenManagementService).should().revokeUserTokensBySessionId(1L, "session-abc");
    }

    @Test
    @DisplayName("revoke all other sessions current session")
    void revokeAllOtherSessions_currentSession() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        given(userService.getCurrentUserId()).willReturn(1L);
        given(requestContextService.getCurrentRequest()).willReturn(request);
        given(cookieService.extractAccessTokenFromCookie(request)).willReturn("access.token.value");
        given(jwtService.extractJwtId("access.token.value")).willReturn("jwt-id-123");
        given(tokenManagementService.getTokenByJwtId("jwt-id-123"))
                .willReturn(Token.builder()
                        .jwtId("jwt-id-123")
                        .sessionId("current-session")
                        .build());

        // when
        service.revokeAllOtherSessions();

        // then
        then(tokenManagementService).should().revokeUserTokensExceptSession(1L, "current-session");
    }

    @Test
    @DisplayName("revoke all other sessions no current session")
    void revokeAllOtherSessions_noCurrentSession() {
        // given
        given(userService.getCurrentUserId()).willReturn(1L);
        given(requestContextService.getCurrentRequest()).willReturn(null);

        // when
        service.revokeAllOtherSessions();

        // then
        then(tokenManagementService).shouldHaveNoMoreInteractions();
    }
}
