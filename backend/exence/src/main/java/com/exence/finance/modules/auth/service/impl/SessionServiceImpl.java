package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import com.exence.finance.modules.auth.dto.SessionSummaryProjection;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.mapper.SessionMapper;
import com.exence.finance.modules.auth.service.CookieService;
import com.exence.finance.modules.auth.service.RequestContextService;
import com.exence.finance.modules.auth.service.SessionService;
import com.exence.finance.modules.auth.service.TokenManagementService;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionServiceImpl implements SessionService {
    private final TokenManagementService tokenManagementService;
    private final UserService userService;
    private final JwtService jwtService;
    private final SessionMapper sessionMapper;
    private final CookieService cookieService;
    private final RequestContextService requestContextService;

    @Override
    @ReadTransactional
    public List<DeviceSessionDTO> getActiveSessions() {
        Long userId = userService.getCurrentUserId();
        List<SessionSummaryProjection> sessions = tokenManagementService.findActiveSessions(userId);
        String currentSessionId = getCurrentSessionId();

        return sessionMapper.mapToDeviceSessionDTOList(sessions, currentSessionId);
    }

    @Override
    @WriteTransactional
    public void revokeSession(String sessionId) {
        Long userId = userService.getCurrentUserId();
        tokenManagementService.revokeUserTokensBySessionId(userId, sessionId);
    }

    @Override
    @WriteTransactional
    public void revokeAllOtherSessions() {
        Long userId = userService.getCurrentUserId();
        String currentSessionId = getCurrentSessionId();

        if (currentSessionId != null) {
            tokenManagementService.revokeUserTokensExceptSession(userId, currentSessionId);
        }
    }

    private String getCurrentSessionId() {
        try {
            HttpServletRequest request = requestContextService.getCurrentRequest();
            if (request == null) return null;

            String jwt = cookieService.extractAccessTokenFromCookie(request);
            if (jwt == null) return null;

            String jwtId = jwtService.extractJwtId(jwt);

            if (jwtId == null) return null;

            Token token = tokenManagementService.getTokenByJwtId(jwtId);
            return token != null ? token.getSessionId() : null;
        } catch (Exception e) {
            log.debug("Could not determine current session ID: {}", e.getMessage());
            return null;
        }
    }
}
