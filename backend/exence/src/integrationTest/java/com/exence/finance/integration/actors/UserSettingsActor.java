package com.exence.finance.integration.actors;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;
import io.restassured.config.RestAssuredConfig;
import io.restassured.response.ValidatableResponse;

/**
 * Domain DSL for user settings operations.
 *
 * <p>Encapsulates RestAssured calls for: getting and updating the current user's settings.
 */
public class UserSettingsActor extends BaseActor {

    public UserSettingsActor(RestAssuredConfig config) {
        super(config);
    }

    /** Returns the current user's settings. */
    public UserSettingsResponse getSettings(AuthContext ctx) {
        return inWorkspace(ctx)
                .when()
                .get("/user/settings")
                .then()
                .statusCode(200)
                .extract()
                .as(UserSettingsResponse.class);
    }

    /** Updates the current user's settings and returns the updated resource. */
    public UserSettingsResponse patchSettings(AuthContext ctx, UpdateUserSettingsRequest request) {
        return inWorkspace(ctx)
                .body(request)
                .when()
                .patch("/user/settings")
                .then()
                .statusCode(200)
                .extract()
                .as(UserSettingsResponse.class);
    }

    // -------------------------------------------------------------------------
    // Error-path variants
    // -------------------------------------------------------------------------

    public ValidatableResponse patchSettingsRaw(AuthContext ctx, UpdateUserSettingsRequest request) {
        return inWorkspace(ctx).body(request).when().patch("/user/settings").then();
    }
}
