package com.exence.finance.integration.actors;

import static io.restassured.RestAssured.given;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.auditlog.dto.AuditLogDTO;
import io.restassured.config.RestAssuredConfig;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;
import java.util.List;

/**
 * Domain DSL for audit log operations.
 *
 * <p>Encapsulates RestAssured calls for: listing workspace audit logs with optional filters.
 * Audit log endpoints require workspace context and OWNER role.
 */
public class AuditLogActor extends BaseActor {

    public AuditLogActor(int port, RestAssuredConfig config) {
        super(port, config);
    }

    /** Returns all audit log entries for the current workspace. */
    public List<AuditLogDTO> listAuditLogs(AuthContext ctx) {
        return inWorkspace(ctx)
                .when()
                .get("/audit-logs")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("content", AuditLogDTO.class);
    }

    /** Returns audit log entries filtered by entity type and/or change type. */
    public List<AuditLogDTO> listAuditLogs(AuthContext ctx, String entityType, String changeType) {
        RequestSpecification req = inWorkspace(ctx);
        if (entityType != null) {
            req = req.queryParam("entityType", entityType);
        }
        if (changeType != null) {
            req = req.queryParam("changeType", changeType);
        }
        return req.when()
                .get("/audit-logs")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("content", AuditLogDTO.class);
    }

    // -------------------------------------------------------------------------
    // Error-path variants
    // -------------------------------------------------------------------------

    public ValidatableResponse listAuditLogsRaw(AuthContext ctx) {
        return inWorkspace(ctx).when().get("/audit-logs").then();
    }

    /** Calls audit-logs without any authentication cookies. */
    public ValidatableResponse listAuditLogsUnauthenticated() {
        return given(spec).when().get("/audit-logs").then();
    }
}
