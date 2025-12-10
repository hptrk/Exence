package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.dto.DeviceSessionDTO;

import java.util.List;

public interface SessionService {

    List<DeviceSessionDTO> getActiveSessions();

    void revokeSession(String sessionId);

    void revokeAllOtherSessions();

}
