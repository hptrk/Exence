package com.exence.finance.integration.actors;

import static io.restassured.RestAssured.given;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.workspace.dto.WorkspaceCreateRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceRenameRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsPatchRequest;
import io.restassured.config.RestAssuredConfig;
import io.restassured.response.ValidatableResponse;
import java.util.List;

/**
 * Domain DSL for workspace and workspace settings operations.
 *
 * <p>Encapsulates RestAssured calls for: create, list, rename, delete workspaces,
 * member management, and workspace settings.
 */
public class WorkspaceActor extends BaseActor {

    public WorkspaceActor(int port, RestAssuredConfig config) {
        super(port, config);
    }

    // -------------------------------------------------------------------------
    // Workspace CRUD
    // -------------------------------------------------------------------------

    /** Creates a workspace. No workspace header required for this endpoint. */
    public WorkspaceGetDTO createWorkspace(AuthContext ctx, WorkspaceCreateRequest request) {
        return given(spec)
                .cookies(ctx.cookies())
                .body(request)
                .when()
                .post("/workspaces")
                .then()
                .statusCode(200)
                .extract()
                .as(WorkspaceGetDTO.class);
    }

    /** Lists all workspaces the current user is a member of. No workspace header required. */
    public List<WorkspaceGetDTO> listWorkspaces(AuthContext ctx) {
        WorkspaceGetDTO[] result = given(spec)
                .cookies(ctx.cookies())
                .when()
                .get("/workspaces")
                .then()
                .statusCode(200)
                .extract()
                .as(WorkspaceGetDTO[].class);
        return List.of(result);
    }

    /** Renames the given workspace. */
    public WorkspaceGetDTO renameWorkspace(AuthContext ctx, long workspaceId, WorkspaceRenameRequest request) {
        return inWorkspace(ctx)
                .body(request)
                .when()
                .patch("/workspaces/{id}", workspaceId)
                .then()
                .statusCode(200)
                .extract()
                .as(WorkspaceGetDTO.class);
    }

    /** Deletes the given workspace. */
    public void deleteWorkspace(AuthContext ctx, long workspaceId) {
        inWorkspace(ctx).when().delete("/workspaces/{id}", workspaceId).then().statusCode(204);
    }

    // -------------------------------------------------------------------------
    // Member management
    // -------------------------------------------------------------------------

    /** Adds a member to the given workspace by email. */
    public WorkspaceMemberGetDTO addMember(AuthContext ctx, long workspaceId, WorkspaceMemberEmailRequest request) {
        return inWorkspace(ctx)
                .body(request)
                .when()
                .post("/workspaces/{id}/members", workspaceId)
                .then()
                .statusCode(200)
                .extract()
                .as(WorkspaceMemberGetDTO.class);
    }

    /** Lists all members of the given workspace. */
    public List<WorkspaceMemberGetDTO> listMembers(AuthContext ctx, long workspaceId) {
        WorkspaceMemberGetDTO[] result = inWorkspace(ctx)
                .when()
                .get("/workspaces/{id}/members", workspaceId)
                .then()
                .statusCode(200)
                .extract()
                .as(WorkspaceMemberGetDTO[].class);
        return List.of(result);
    }

    /** Removes a member from the given workspace by email. */
    public void removeMember(AuthContext ctx, long workspaceId, WorkspaceMemberEmailRequest request) {
        inWorkspace(ctx)
                .body(request)
                .when()
                .delete("/workspaces/{id}/members", workspaceId)
                .then()
                .statusCode(204);
    }

    /** Removes the current user from the given workspace. */
    public void leaveWorkspace(AuthContext ctx, long workspaceId) {
        inWorkspace(ctx)
                .when()
                .delete("/workspaces/{id}/members/me", workspaceId)
                .then()
                .statusCode(204);
    }

    // -------------------------------------------------------------------------
    // Workspace settings
    // -------------------------------------------------------------------------

    /** Returns settings for the current workspace. */
    public WorkspaceSettingsGetDTO getSettings(AuthContext ctx) {
        return inWorkspace(ctx)
                .when()
                .get("/workspaces/settings")
                .then()
                .statusCode(200)
                .extract()
                .as(WorkspaceSettingsGetDTO.class);
    }

    /** Updates settings for the current workspace. */
    public WorkspaceSettingsGetDTO patchSettings(AuthContext ctx, WorkspaceSettingsPatchRequest request) {
        return inWorkspace(ctx)
                .body(request)
                .when()
                .patch("/workspaces/settings")
                .then()
                .statusCode(200)
                .extract()
                .as(WorkspaceSettingsGetDTO.class);
    }

    // -------------------------------------------------------------------------
    // Error-path variants
    // -------------------------------------------------------------------------

    public ValidatableResponse deleteWorkspaceRaw(AuthContext ctx, long workspaceId) {
        return inWorkspace(ctx).when().delete("/workspaces/{id}", workspaceId).then();
    }

    public ValidatableResponse addMemberRaw(AuthContext ctx, long workspaceId, WorkspaceMemberEmailRequest request) {
        return inWorkspace(ctx).body(request).when().post("/workspaces/{id}/members", workspaceId).then();
    }

    public ValidatableResponse removeMemberRaw(AuthContext ctx, long workspaceId, WorkspaceMemberEmailRequest request) {
        return inWorkspace(ctx).body(request).when().delete("/workspaces/{id}/members", workspaceId).then();
    }

    public ValidatableResponse leaveWorkspaceRaw(AuthContext ctx, long workspaceId) {
        return inWorkspace(ctx).when().delete("/workspaces/{id}/members/me", workspaceId).then();
    }

    public ValidatableResponse renameWorkspaceRaw(AuthContext ctx, long workspaceId, WorkspaceRenameRequest request) {
        return inWorkspace(ctx).body(request).when().patch("/workspaces/{id}", workspaceId).then();
    }

    public ValidatableResponse patchSettingsRaw(AuthContext ctx, WorkspaceSettingsPatchRequest request) {
        return inWorkspace(ctx).body(request).when().patch("/workspaces/settings").then();
    }
}
