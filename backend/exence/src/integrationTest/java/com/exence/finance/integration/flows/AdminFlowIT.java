package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;

import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.email.dto.BroadcastEmailRequest;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsPatchRequest;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 12 — Admin
 *
 * <p>FLOW-ADMIN-01: Admin permissions and platform-level operations
 */
class AdminFlowIT extends BaseFlowIT {

    @Test
    void flowAdmin01_adminPermissionsAndPlatformOperations() {
        // 1. Use existing ADMIN user to register a new admin
        AuthContext existingAdmin = authActor().loginAsAdmin();
        AuthContext newAdmin = adminActor()
                .registerAdmin(existingAdmin, ITFixtures.registerRequest().build());
        assertThat(newAdmin.user()).isNotNull();

        // 2. Login as new admin → 200 (already done via registerAdmin response)
        AuthContext admin = authActor().login(newAdmin.user().email(), "Password123!");

        // 3. GET admin widget data DAILY_ACTIVE_USERS → 200
        adminActor().getWidgetDataRaw(admin, "DAILY_ACTIVE_USERS").statusCode(200);

        // 4. GET /admin/system-settings → 200
        var settings = adminActor().getSystemSettings(admin);
        assertThat(settings).isNotNull();

        // 5. PATCH system settings → 200, updated value
        var patchReq = new SystemSettingsPatchRequest(null, null, null, null, !settings.logoutFromAllDevices(), null);
        var updated = adminActor().patchSystemSettings(admin, patchReq);
        assertThat(updated.logoutFromAllDevices()).isEqualTo(!settings.logoutFromAllDevices());

        // 6. GET admin audit logs → 200
        var auditLogs = adminActor().listAdminAuditLogs(admin);
        assertThat(auditLogs).isNotNull();

        // 7. Broadcast email → 200 (async, EmailService is mocked in tests)
        adminActor().broadcastEmail(admin, new BroadcastEmailRequest("Test Subject", "<p>Test</p>"));

        // 8-10. Normal user cannot access admin endpoints
        AuthContext normalUser = authActor().registerVerifiedUser();
        adminActor().getAdminWidgetDataRaw(normalUser, "TOTAL_USERS").statusCode(401);
        adminActor().getSystemSettingsRaw(normalUser).statusCode(401);
        adminActor().getAdminAuditLogsRaw(normalUser).statusCode(401);
    }
}
