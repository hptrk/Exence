package com.exence.finance.integration.actors;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.investment.dto.InvestmentCreateDTO;
import com.exence.finance.modules.investment.dto.InvestmentGetDTO;
import com.exence.finance.modules.investment.dto.InvestmentGroupDTO;
import com.exence.finance.modules.investment.dto.InvestmentPatchDTO;
import io.restassured.config.RestAssuredConfig;
import io.restassured.response.ValidatableResponse;
import java.util.Arrays;
import java.util.List;

/**
 * Domain DSL for investment operations.
 *
 * <p>Encapsulates RestAssured calls for: create, list, patch, delete investments,
 * get grouped portfolio view, and widget data.
 */
public class InvestmentActor extends BaseActor {

    public InvestmentActor(RestAssuredConfig config) {
        super(config);
    }

    /** Creates an investment and returns the created resource. */
    public InvestmentGetDTO createInvestment(AuthContext ctx, InvestmentCreateDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .post("/investments")
                .then()
                .statusCode(201)
                .extract()
                .as(InvestmentGetDTO.class);
    }

    /** Returns all investments for the current workspace. */
    public List<InvestmentGetDTO> listInvestments(AuthContext ctx) {
        InvestmentGetDTO[] result = inWorkspace(ctx)
                .when()
                .get("/investments")
                .then()
                .statusCode(200)
                .extract()
                .as(InvestmentGetDTO[].class);
        return List.of(result);
    }

    /** Returns investments grouped by asset name. */
    public List<InvestmentGroupDTO> listGrouped(AuthContext ctx) {
        InvestmentGroupDTO[] result = inWorkspace(ctx)
                .when()
                .get("/investments/grouped")
                .then()
                .statusCode(200)
                .extract()
                .as(InvestmentGroupDTO[].class);
        return Arrays.asList(result);
    }

    /** Updates an investment with the given patch DTO. */
    public InvestmentGetDTO patchInvestment(AuthContext ctx, long id, InvestmentPatchDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .patch("/investments/{id}", id)
                .then()
                .statusCode(200)
                .extract()
                .as(InvestmentGetDTO.class);
    }

    /** Deletes the investment with the given ID. */
    public void deleteInvestment(AuthContext ctx, long id) {
        inWorkspace(ctx).when().delete("/investments/{id}", id).then().statusCode(204);
    }

    // -------------------------------------------------------------------------
    // Error-path variants
    // -------------------------------------------------------------------------

    /** Calls the investment widget endpoint with an arbitrary type string for error testing. */
    public ValidatableResponse getWidgetDataRaw(AuthContext ctx, String type) {
        return inWorkspace(ctx)
                .when()
                .get("/investments/statistics/{type}", type)
                .then();
    }
}
