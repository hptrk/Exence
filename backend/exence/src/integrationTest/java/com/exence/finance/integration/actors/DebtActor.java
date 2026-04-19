package com.exence.finance.integration.actors;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtGetDTO;
import com.exence.finance.modules.debt.dto.DebtPatchDTO;
import com.exence.finance.modules.debt.dto.DebtPaymentDTO;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import io.restassured.config.RestAssuredConfig;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;
import java.util.Arrays;
import java.util.List;

/**
 * Domain DSL for debt operations.
 *
 * <p>Encapsulates RestAssured calls for: create, get, list, patch, delete debts
 * and recording debt payments.
 */
public class DebtActor extends BaseActor {

    public DebtActor(int port, RestAssuredConfig config) {
        super(port, config);
    }

    /** Creates a debt and returns the created resource. */
    public DebtGetDTO createDebt(AuthContext ctx, DebtCreateDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .post("/debts")
                .then()
                .statusCode(201)
                .extract()
                .as(DebtGetDTO.class);
    }

    /** Fetches a debt by ID. */
    public DebtGetDTO getDebt(AuthContext ctx, long id) {
        return inWorkspace(ctx)
                .when()
                .get("/debts/{id}", id)
                .then()
                .statusCode(200)
                .extract()
                .as(DebtGetDTO.class);
    }

    /** Returns all debts for the current workspace. */
    public List<DebtGetDTO> listDebts(AuthContext ctx) {
        DebtGetDTO[] result = inWorkspace(ctx)
                .when()
                .get("/debts")
                .then()
                .statusCode(200)
                .extract()
                .as(DebtGetDTO[].class);
        return List.of(result);
    }

    /** Returns debts filtered by type. */
    public List<DebtGetDTO> listDebtsByType(AuthContext ctx, DebtType type) {
        DebtGetDTO[] result = inWorkspace(ctx)
                .queryParam("type", type.name())
                .when()
                .get("/debts")
                .then()
                .statusCode(200)
                .extract()
                .as(DebtGetDTO[].class);
        return Arrays.asList(result);
    }

    /** Returns debts filtered by one or more statuses. */
    public List<DebtGetDTO> listDebtsByStatus(AuthContext ctx, DebtStatus... statuses) {
        RequestSpecification req = inWorkspace(ctx);
        for (DebtStatus s : statuses) {
            req = req.queryParam("statuses", s.name());
        }
        DebtGetDTO[] result = req.when().get("/debts").then().statusCode(200).extract().as(DebtGetDTO[].class);
        return Arrays.asList(result);
    }

    /** Updates a debt with the given patch DTO. */
    public DebtGetDTO patchDebt(AuthContext ctx, long id, DebtPatchDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .patch("/debts/{id}", id)
                .then()
                .statusCode(200)
                .extract()
                .as(DebtGetDTO.class);
    }

    /** Records a payment for the given debt. */
    public DebtGetDTO payDebt(AuthContext ctx, long id, DebtPaymentDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .patch("/debts/{id}/payment", id)
                .then()
                .statusCode(200)
                .extract()
                .as(DebtGetDTO.class);
    }

    /** Deletes the debt with the given ID. */
    public void deleteDebt(AuthContext ctx, long id) {
        inWorkspace(ctx).when().delete("/debts/{id}", id).then().statusCode(204);
    }

    // -------------------------------------------------------------------------
    // Error-path variants
    // -------------------------------------------------------------------------

    public ValidatableResponse payDebtRaw(AuthContext ctx, long id, DebtPaymentDTO dto) {
        return inWorkspace(ctx).body(dto).when().patch("/debts/{id}/payment", id).then();
    }

    public ValidatableResponse listDebtsRaw(AuthContext ctx) {
        return inWorkspace(ctx).when().get("/debts").then();
    }

    public ValidatableResponse getWidgetDataRaw(AuthContext ctx, String type) {
        return inWorkspace(ctx).queryParam("type", type).when().get("/debts/widget-data").then();
    }
}
