package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 4 — Workspace Lifecycle
 *
 * <p>FLOW-WS-01: Workspace CRUD and last-workspace protection
 * <p>FLOW-WS-02: Workspace settings management (owner permissions)
 * <p>FLOW-WS-03: Member invite, leave, and remove lifecycle
 */
class WorkspaceFlowIT extends BaseFlowIT {

    @Test
    void flowWs01_workspaceCrudAndLastWorkspaceProtection() {
        // 1. Register (first workspace auto-created)
        AuthContext user = authActor().registerVerifiedUser();
        long ws1Id = user.workspaceId();

        // 2. GET /workspaces → 1 workspace, OWNER role
        assertThat(workspaceActor().listWorkspaces(user)).hasSize(1);

        // 3. DELETE last workspace → 409 WORKSPACE_CANNOT_DELETE_LAST
        workspaceActor().deleteWorkspaceRaw(user, ws1Id)
                .statusCode(409)
                .body("code", equalTo("workspace-cannot-delete-last"));

        // 4. POST /workspaces → 201, second workspace
        var ws2 = workspaceActor().createWorkspace(user, ITFixtures.workspace().name("Second WS").build());

        // 5. GET /workspaces → 2 workspaces
        assertThat(workspaceActor().listWorkspaces(user)).hasSize(2);

        // 6. PATCH /workspaces/{ws2_id} → 200, new name in response
        var renamed = workspaceActor().renameWorkspace(user, ws2.id(), ITFixtures.workspaceRename().name("Renamed WS").build());
        assertThat(renamed.name()).isEqualTo("Renamed WS");

        // 7. DELETE /workspaces/{ws1_id} → 204
        workspaceActor().deleteWorkspace(user.withWorkspace(ws1Id), ws1Id);

        // 8. GET /workspaces → 1 workspace remains
        assertThat(workspaceActor().listWorkspaces(user)).hasSize(1);

        // 9. PATCH non-existent workspace → 404 WORKSPACE_NOT_FOUND
        workspaceActor().renameWorkspaceRaw(user.withWorkspace(ws1Id), ws1Id, ITFixtures.workspaceRename().build())
                .statusCode(404)
                .body("code", equalTo("workspace-not-found"));
    }

    @Test
    void flowWs02_workspaceSettingsOwnerPermissions() {
        // 1. Register userA
        AuthContext userA = authActor().registerVerifiedUser();
        long wsId = userA.workspaceId();

        // 2. Register userB
        AuthContext userB = authActor().registerVerifiedUser();

        // 3. UserA: add userB as MEMBER
        workspaceActor().addMember(userA, wsId, new WorkspaceMemberEmailRequest(userB.user().email()));

        // userB context in workspace A
        AuthContext userBInWsA = userB.withWorkspace(wsId);

        // 4. UserA: GET /workspaces/settings → baseCurrency, showBaseCurrency present
        var settings = workspaceActor().getSettings(userA);
        assertThat(settings).isNotNull();

        // 5. UserA: PATCH showBaseCurrency=false → 200, new value visible
        var patched = workspaceActor().patchSettings(userA,
                ITFixtures.workspaceSettings().currency(settings.baseCurrency()).showBaseCurrency(false).build());
        assertThat(patched.showBaseCurrency()).isFalse();

        // 6. UserB (MEMBER): PATCH → 403 WORKSPACE_OWNER_REQUIRED
        workspaceActor().patchSettingsRaw(userBInWsA,
                        ITFixtures.workspaceSettings().currency(settings.baseCurrency()).showBaseCurrency(true).build())
                .statusCode(403)
                .body("code", equalTo("workspace-owner-required"));

        // 7. UserB: GET settings → 200 (read is allowed for members)
        workspaceActor().getSettings(userBInWsA);
    }

    @Test
    void flowWs03_memberInviteLeaveAndRemoveLifecycle() {
        // 1-2. Two users register
        AuthContext userA = authActor().registerVerifiedUser();
        AuthContext userB = authActor().registerVerifiedUser();
        long wsId = userA.workspaceId();

        // 3. UserA invites userB → 200
        workspaceActor().addMember(userA, wsId, new WorkspaceMemberEmailRequest(userB.user().email()));

        // 4. Invite again → 409 WORKSPACE_MEMBER_ALREADY_EXISTS
        workspaceActor().addMemberRaw(userA, wsId, new WorkspaceMemberEmailRequest(userB.user().email()))
                .statusCode(409)
                .body("code", equalTo("workspace-member-already-exists"));

        // 5. GET /workspaces/{id}/members → 2 members (A: OWNER, B: MEMBER)
        assertThat(workspaceActor().listMembers(userA, wsId)).hasSize(2);

        // 6. UserB: GET /workspaces → workspace A appears
        assertThat(workspaceActor().listWorkspaces(userB).stream()
                .anyMatch(ws -> ws.id() == wsId)).isTrue();

        // 7. UserB: leave workspace → 204
        workspaceActor().leaveWorkspace(userB.withWorkspace(wsId), wsId);

        // 8. UserB: GET /workspaces → workspace A is gone
        assertThat(workspaceActor().listWorkspaces(userB).stream()
                .noneMatch(ws -> ws.id() == wsId)).isTrue();

        // 9. UserA: add userB again → 200
        workspaceActor().addMember(userA, wsId, new WorkspaceMemberEmailRequest(userB.user().email()));

        // 10. UserA: remove userB by email → 204
        workspaceActor().removeMember(userA, wsId, new WorkspaceMemberEmailRequest(userB.user().email()));

        // 11. UserA (owner): leave own workspace → 409 WORKSPACE_OWNER_CANNOT_LEAVE
        workspaceActor().leaveWorkspaceRaw(userA, wsId)
                .statusCode(409)
                .body("code", equalTo("workspace-owner-cannot-leave"));

        // 12. Remove owner by email → 409 WORKSPACE_OWNER_CANNOT_BE_REMOVED
        workspaceActor().removeMemberRaw(userA, wsId, new WorkspaceMemberEmailRequest(userA.user().email()))
                .statusCode(409)
                .body("code", equalTo("workspace-owner-cannot-be-removed"));
    }
}
