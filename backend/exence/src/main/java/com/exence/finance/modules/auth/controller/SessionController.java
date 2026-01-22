package com.exence.finance.modules.auth.controller;

import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface SessionController {

    ResponseEntity<List<DeviceSessionDTO>> getActiveSessions();

    ResponseEntity<Void> revokeSession(String sessionId);

    ResponseEntity<Void> revokeAllOtherSessions();
}
