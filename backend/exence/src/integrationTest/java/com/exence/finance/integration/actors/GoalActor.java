package com.exence.finance.integration.actors;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.dto.GoalGetDTO;
import com.exence.finance.modules.goal.dto.GoalPatchDTO;
import com.exence.finance.modules.goal.enums.GoalStatus;
import io.restassured.config.RestAssuredConfig;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;
import java.util.Arrays;
import java.util.List;

/**
 * Domain DSL for savings goal operations.
 *
 * <p>Encapsulates RestAssured calls for: create, get, list, patch, and delete goals.
 */
public class GoalActor extends BaseActor {

    public GoalActor(RestAssuredConfig config) {
        super(config);
    }

    /** Creates a goal and returns the created resource. */
    public GoalGetDTO createGoal(AuthContext ctx, GoalCreateDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .post("/goals")
                .then()
                .statusCode(201)
                .extract()
                .as(GoalGetDTO.class);
    }

    /** Fetches a goal by ID. */
    public GoalGetDTO getGoal(AuthContext ctx, long id) {
        return inWorkspace(ctx)
                .when()
                .get("/goals/{id}", id)
                .then()
                .statusCode(200)
                .extract()
                .as(GoalGetDTO.class);
    }

    /** Returns all goals for the current workspace. */
    public List<GoalGetDTO> listGoals(AuthContext ctx) {
        GoalGetDTO[] result = inWorkspace(ctx)
                .when()
                .get("/goals")
                .then()
                .statusCode(200)
                .extract()
                .as(GoalGetDTO[].class);
        return List.of(result);
    }

    /** Returns goals filtered by one or more statuses. */
    public List<GoalGetDTO> listGoals(AuthContext ctx, GoalStatus... statuses) {
        RequestSpecification req = inWorkspace(ctx);
        for (GoalStatus s : statuses) {
            req = req.queryParam("statuses", s.name());
        }
        GoalGetDTO[] result =
                req.when().get("/goals").then().statusCode(200).extract().as(GoalGetDTO[].class);
        return Arrays.asList(result);
    }

    /** Updates a goal with the given patch DTO. */
    public GoalGetDTO patchGoal(AuthContext ctx, long id, GoalPatchDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .patch("/goals/{id}", id)
                .then()
                .statusCode(200)
                .extract()
                .as(GoalGetDTO.class);
    }

    /** Deletes the goal with the given ID. */
    public void deleteGoal(AuthContext ctx, long id) {
        inWorkspace(ctx).when().delete("/goals/{id}", id).then().statusCode(204);
    }

    // -------------------------------------------------------------------------
    // Error-path variants (email verification barrier, 404)
    // -------------------------------------------------------------------------

    public ValidatableResponse createGoalRaw(AuthContext ctx, GoalCreateDTO dto) {
        return inWorkspace(ctx).body(dto).when().post("/goals").then();
    }

    public ValidatableResponse getGoalRaw(AuthContext ctx, long id) {
        return inWorkspace(ctx).when().get("/goals/{id}", id).then();
    }

    public ValidatableResponse listGoalsRaw(AuthContext ctx) {
        return inWorkspace(ctx).when().get("/goals").then();
    }

    public ValidatableResponse getWidgetDataRaw(AuthContext ctx, String type) {
        return inWorkspace(ctx).when().get("/goals/statistics/{type}", type).then();
    }

    public ValidatableResponse getWidgetDataRaw(AuthContext ctx, String type, Long goalId) {
        io.restassured.specification.RequestSpecification req = inWorkspace(ctx);
        if (goalId != null) {
            req = req.queryParam("goalId", goalId);
        }
        return req.when().get("/goals/statistics/{type}", type).then();
    }
}
