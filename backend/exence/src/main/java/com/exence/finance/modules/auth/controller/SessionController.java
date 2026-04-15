package com.exence.finance.modules.auth.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;

@Tag(name = "Sessions", description = "Manage active user sessions across devices")
public interface SessionController {

    @ExenceOpenApi(
            summary = "List active sessions",
            description =
                    "Returns all currently active sessions (device entries) for the authenticated user. Each entry"
                            + " includes device name, IP address, and whether it is the current session. Sessions are"
                            + " identified by their unique session ID derived from the JWT.",
            successStatus = 200,
            successDescription = "List of active device sessions returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<List<DeviceSessionDTO>> getActiveSessions();

    @ExenceOpenApi(
            summary = "Revoke a specific session",
            description = "Invalidates all tokens (access and refresh) belonging to the session identified by the given"
                    + " session ID. The session ID corresponds to the value returned by the list-sessions"
                    + " endpoint. The user can use this to log out a specific device remotely.",
            successStatus = 204,
            successDescription = "Session revoked successfully.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<Void> revokeSession(String sessionId);

    @ExenceOpenApi(
            summary = "Revoke all other sessions",
            description =
                    "Invalidates all active sessions for the authenticated user except the current one. Useful for"
                            + " signing out all other devices at once after a security concern. The current session"
                            + " is identified from the access token in the cookie.",
            successStatus = 204,
            successDescription = "All other sessions revoked successfully.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<Void> revokeAllOtherSessions();
}
