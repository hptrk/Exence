package com.exence.finance.integration.actors;

import static io.restassured.RestAssured.given;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.exence.finance.modules.auth.dto.UserPatchDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import io.restassured.config.RestAssuredConfig;
import io.restassured.http.Cookies;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;

/**
 * Domain DSL for user profile operations.
 *
 * <p>Encapsulates RestAssured calls for: get/update/delete user profile,
 * change password, and request email verification. These endpoints are user-scoped
 * and do not require the X-Workspace-ID header.
 */
public class UserActor extends BaseActor {

    public UserActor(int port, RestAssuredConfig config) {
        super(port, config);
    }

    /** Returns the currently authenticated user's profile. */
    public UserGetDTO getUser(AuthContext ctx) {
        return asUser(ctx).when().get("/user").then().statusCode(200).extract().as(UserGetDTO.class);
    }

    /** Updates the current user's profile (e.g. username) and returns the updated resource. */
    public UserGetDTO patchUser(AuthContext ctx, UserPatchDTO dto) {
        return asUser(ctx).body(dto).when().patch("/user").then().statusCode(200).extract().as(UserGetDTO.class);
    }

    /** Deletes the current user's account. */
    public void deleteUser(AuthContext ctx) {
        asUser(ctx).when().delete("/user").then().statusCode(204);
    }

    /** Changes the current user's password. */
    public void changePassword(AuthContext ctx, ChangePasswordRequest req) {
        asUser(ctx).body(req).when().post("/user/change-password").then().statusCode(204);
    }

    /** Requests a new email-verification email for the current user. */
    public void requestVerifyEmail(AuthContext ctx) {
        asUser(ctx).when().post("/user/request-verify-email").then().statusCode(204);
    }

    // -------------------------------------------------------------------------
    // Error-path variants
    // -------------------------------------------------------------------------

    public ValidatableResponse getUserRaw(Cookies cookies) {
        return given(spec).cookies(cookies).when().get("/user").then();
    }

    public ValidatableResponse changePasswordRaw(AuthContext ctx, ChangePasswordRequest req) {
        return asUser(ctx).body(req).when().post("/user/change-password").then();
    }

    public ValidatableResponse requestVerifyEmailRaw(AuthContext ctx) {
        return asUser(ctx).when().post("/user/request-verify-email").then();
    }

    private RequestSpecification asUser(AuthContext ctx) {
        return given(spec).cookies(ctx.cookies());
    }
}
