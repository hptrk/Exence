package com.exence.finance.integration.actors;

import static io.restassured.RestAssured.given;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.auditlog.dto.AuditLogDTO;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.email.dto.BroadcastEmailRequest;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsPatchRequest;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsResponse;
import io.restassured.config.RestAssuredConfig;
import io.restassured.http.Cookies;
import io.restassured.response.Response;
import io.restassured.response.ValidatableResponse;
import java.util.List;

/**
 * Domain DSL for admin-only operations.
 *
 * <p>Encapsulates RestAssured calls for: registering new admin users, accessing system
 * settings, reading platform audit logs, and sending broadcast emails.
 */
public class AdminActor extends BaseActor {

    public AdminActor(int port, RestAssuredConfig config) {
        super(port, config);
    }

    /** Registers a new ADMIN user using existing admin credentials. */
    public AuthContext registerAdmin(AuthContext adminCtx, RegisterRequest request) {
        Response response = given(spec)
                .cookies(adminCtx.cookies())
                .body(request)
                .when()
                .post("/admin/auth/register");
        response.then().statusCode(200);
        Cookies cookies = response.getDetailedCookies();
        AuthenticationResponse body = response.as(AuthenticationResponse.class);
        return new AuthContext(cookies, body.workspaceId(), body.user());
    }

    /** Returns the current system settings (admin only). */
    public SystemSettingsResponse getSystemSettings(AuthContext ctx) {
        return given(spec)
                .cookies(ctx.cookies())
                .when()
                .get("/admin/system-settings")
                .then()
                .statusCode(200)
                .extract()
                .as(SystemSettingsResponse.class);
    }

    /** Updates system settings (admin only). */
    public SystemSettingsResponse patchSystemSettings(AuthContext ctx, SystemSettingsPatchRequest request) {
        return given(spec)
                .cookies(ctx.cookies())
                .body(request)
                .when()
                .patch("/admin/system-settings")
                .then()
                .statusCode(200)
                .extract()
                .as(SystemSettingsResponse.class);
    }

    /** Returns platform-level audit logs (admin only). */
    public List<AuditLogDTO> listAdminAuditLogs(AuthContext ctx) {
        return given(spec)
                .cookies(ctx.cookies())
                .when()
                .get("/admin/audit-logs")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("content", AuditLogDTO.class);
    }

    /** Sends a broadcast email to all users (admin only, asynchronous). */
    public void broadcastEmail(AuthContext ctx, BroadcastEmailRequest request) {
        given(spec)
                .cookies(ctx.cookies())
                .body(request)
                .when()
                .post("/admin/email/broadcast")
                .then()
                .statusCode(200);
    }

    /** Returns widget data for a given admin widget type (admin only). */
    public ValidatableResponse getWidgetDataRaw(AuthContext ctx, String type) {
        return given(spec)
                .cookies(ctx.cookies())
                .queryParam("type", type)
                .when()
                .get("/admin/statistics/widgets/data")
                .then();
    }

    // -------------------------------------------------------------------------
    // Error-path variants (for normal user access tests)
    // -------------------------------------------------------------------------

    public ValidatableResponse getSystemSettingsRaw(AuthContext ctx) {
        return given(spec).cookies(ctx.cookies()).when().get("/admin/system-settings").then();
    }

    public ValidatableResponse getAdminAuditLogsRaw(AuthContext ctx) {
        return given(spec).cookies(ctx.cookies()).when().get("/admin/audit-logs").then();
    }

    public ValidatableResponse getAdminWidgetDataRaw(AuthContext ctx, String type) {
        return given(spec).cookies(ctx.cookies()).queryParam("type", type)
                .when().get("/admin/statistics/widgets/data").then();
    }
}
