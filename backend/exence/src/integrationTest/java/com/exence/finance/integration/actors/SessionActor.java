package com.exence.finance.integration.actors;

import static io.restassured.RestAssured.given;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.auth.dto.DeviceSessionDTO;
import io.restassured.config.RestAssuredConfig;
import io.restassured.specification.RequestSpecification;
import java.util.List;

/**
 * Domain DSL for session management operations.
 *
 * <p>Encapsulates RestAssured calls for: listing active sessions, revoking a specific
 * session, and revoking all other sessions. Session endpoints are excluded from the
 * workspace interceptor and do not require the X-Workspace-ID header.
 */
public class SessionActor extends BaseActor {

    public SessionActor(int port, RestAssuredConfig config) {
        super(port, config);
    }

    /** Returns all active sessions for the current user. */
    public List<DeviceSessionDTO> listSessions(AuthContext ctx) {
        DeviceSessionDTO[] result = asUser(ctx)
                .when()
                .get("/sessions")
                .then()
                .statusCode(200)
                .extract()
                .as(DeviceSessionDTO[].class);
        return List.of(result);
    }

    /** Revokes the session with the given session ID. */
    public void revokeSession(AuthContext ctx, String sessionId) {
        asUser(ctx).when().delete("/sessions/{sessionId}", sessionId).then().statusCode(204);
    }

    /** Revokes all sessions except the current one. */
    public void revokeAllOthers(AuthContext ctx) {
        asUser(ctx).when().delete("/sessions/others").then().statusCode(204);
    }

    private RequestSpecification asUser(AuthContext ctx) {
        return given(spec).cookies(ctx.cookies());
    }
}
