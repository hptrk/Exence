package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import java.util.List;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 2 — Session & Device Management
 *
 * <p>FLOW-SESSION-01: Multi-device session handling and targeted revoke
 * <p>FLOW-SESSION-02: "Log out everywhere" feature
 */
class SessionFlowIT extends BaseFlowIT {

    @Test
    void flowSession01_multiDeviceAndTargetedRevoke() {
        // 1. Register and verify
        AuthContext user = authActor().registerVerifiedUser();
        String email = user.user().email();

        // 2-4. Login from three devices
        AuthContext deviceA = authActor().loginWithUserAgent(email, "Password123!", "TestDeviceA/1.0");
        AuthContext deviceB = authActor().loginWithUserAgent(email, "Password123!", "TestDeviceB/1.0");
        AuthContext deviceC = authActor().loginWithUserAgent(email, "Password123!", "TestDeviceC/1.0");

        // 5. From Device-A: list sessions → 3 sessions, A is current
        List<DeviceSessionDTO> sessions = sessionActor().listSessions(deviceA);
        assertThat(sessions).hasSize(3);
        assertThat(sessions.stream().anyMatch(DeviceSessionDTO::isCurrentSession)).isTrue();

        // Identify Device-B's session ID from Device-B's own perspective (its own session is "current" there)
        String sessionBId = sessionActor().listSessions(deviceB).stream()
                .filter(DeviceSessionDTO::isCurrentSession)
                .findFirst()
                .map(DeviceSessionDTO::sessionId)
                .orElseThrow(() -> new AssertionError("Device-B current session not found"));

        // 6. From Device-A: revoke session B → 204
        sessionActor().revokeSession(deviceA, sessionBId);

        // 7. Device-B: GET /user → 401 (session B revoked)
        userActor().getUserRaw(deviceB.cookies()).statusCode(401);

        // 8. From Device-A: list sessions → 2 sessions (A and C remain)
        assertThat(sessionActor().listSessions(deviceA)).hasSize(2);

        // 9. Device-C is still active
        userActor().getUserRaw(deviceC.cookies()).statusCode(200);
    }

    @Test
    void flowSession02_logoutEverywhere() {
        // 1. Register and verify
        AuthContext user = authActor().registerVerifiedUser();
        String email = user.user().email();

        // 2-4. Login from three devices
        AuthContext deviceA = authActor().loginWithUserAgent(email, "Password123!", "TestDeviceA/1.0");
        AuthContext deviceB = authActor().loginWithUserAgent(email, "Password123!", "TestDeviceB/1.0");
        AuthContext deviceC = authActor().loginWithUserAgent(email, "Password123!", "TestDeviceC/1.0");

        // 5. From Device-A: DELETE /sessions/others → 204
        sessionActor().revokeAllOthers(deviceA);

        // 6. Device-B → 401 (revoked)
        userActor().getUserRaw(deviceB.cookies()).statusCode(401);

        // 7. Device-C → 401 (revoked)
        userActor().getUserRaw(deviceC.cookies()).statusCode(401);

        // 8. Device-A still active
        userActor().getUserRaw(deviceA.cookies()).statusCode(200);

        // 9. List sessions from Device-A → 1 session, isCurrent = true
        List<DeviceSessionDTO> remaining = sessionActor().listSessions(deviceA);
        assertThat(remaining).hasSize(1);
        assertThat(remaining.getFirst().isCurrentSession()).isTrue();
    }
}
