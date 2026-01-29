package com.exence.finance.modules.auth.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.auth.controller.SessionController;
import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import com.exence.finance.modules.auth.service.SessionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class SessionControllerImpl implements SessionController {
    private final SessionService sessionService;

    @GetMapping
    @Override
    public ResponseEntity<List<DeviceSessionDTO>> getActiveSessions() {
        List<DeviceSessionDTO> sessions = sessionService.getActiveSessions();
        return ResponseFactory.ok(sessions);
    }

    @DeleteMapping("/{sessionId}")
    @Override
    public ResponseEntity<Void> revokeSession(@PathVariable String sessionId) {
        sessionService.revokeSession(sessionId);
        return ResponseFactory.noContent();
    }

    @DeleteMapping("/others")
    @Override
    public ResponseEntity<Void> revokeAllOtherSessions() {
        sessionService.revokeAllOtherSessions();
        return ResponseFactory.noContent();
    }
}
