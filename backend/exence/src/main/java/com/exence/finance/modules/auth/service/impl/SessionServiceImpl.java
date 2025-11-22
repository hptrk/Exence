package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import com.exence.finance.modules.auth.dto.SessionSummaryProjection;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.mapper.SessionMapper;
import com.exence.finance.modules.auth.service.RequestContextService;
import com.exence.finance.modules.auth.service.SessionService;
import com.exence.finance.modules.auth.service.TokenManagementService;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SessionServiceImpl implements SessionService {
    private final TokenManagementService tokenManagementService;
    private final UserService userService;
    private final JwtService jwtService;
    private final SessionMapper sessionMapper;
    private final RequestContextService requestContextService;

    @Override
    public List<DeviceSessionDTO> getActiveSessions() {
        Long userId = userService.getCurrentUserId();
        List<SessionSummaryProjection> sessions = tokenManagementService.findActiveSessions(userId);
        String currentSessionId = getCurrentSessionId();

        return sessionMapper.mapToDeviceSessionDTOList(sessions, currentSessionId);
    }

    @Override
    @Transactional
    public void revokeSession(String sessionId) {
        Long userId = userService.getCurrentUserId();
        tokenManagementService.revokeUserTokensBySessionId(userId, sessionId);
    }

    @Override
    @Transactional
    public void revokeAllOtherSessions() {
        Long userId = userService.getCurrentUserId();
        String currentSessionId = getCurrentSessionId();

        if (currentSessionId != null) {
            tokenManagementService.revokeUserTokensExceptSession(userId, currentSessionId);
        }
    }

    private String getCurrentSessionId() {
        try {
            String jwt = requestContextService.extractBearerToken();
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