package com.exence.finance.integration.actors;

import static io.restassured.RestAssured.given;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import com.exence.finance.modules.statistics.dto.WidgetCreateDTO;
import com.exence.finance.modules.statistics.dto.response.WidgetDataResponse;
import com.exence.finance.modules.statistics.dto.response.WidgetLayoutResponse;
import io.restassured.config.RestAssuredConfig;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;

/**
 * Domain DSL for widget and statistics operations.
 *
 * <p>Encapsulates RestAssured calls for: getting the widget layout, fetching widget data,
 * creating widgets, and updating the layout.
 */
public class WidgetActor extends BaseActor {

    public WidgetActor(int port, RestAssuredConfig config) {
        super(port, config);
    }

    /** Returns the full widget layout for the current workspace. */
    public WidgetLayoutResponse getLayout(AuthContext ctx) {
        return inWorkspace(ctx)
                .when()
                .get("/statistics/widgets/layout")
                .then()
                .statusCode(200)
                .extract()
                .as(WidgetLayoutResponse.class);
    }

    /** Returns data for a specific widget, optionally filtered by timeframe. */
    public WidgetDataResponse getWidgetData(AuthContext ctx, long widgetId, Timeframe timeframe) {
        RequestSpecification req = inWorkspace(ctx);
        if (timeframe != null) {
            req = req.queryParam("timeframe", timeframe.name());
        }
        return req.when()
                .get("/statistics/widgets/{id}/data", widgetId)
                .then()
                .statusCode(200)
                .extract()
                .as(WidgetDataResponse.class);
    }

    /** Returns dashboard balance trend data, optionally filtered by timeframe. */
    public WidgetDataResponse getDashboardBalanceTrend(AuthContext ctx, Timeframe timeframe) {
        RequestSpecification req = inWorkspace(ctx);
        if (timeframe != null) {
            req = req.queryParam("timeframe", timeframe.name());
        }
        return req.when()
                .get("/statistics/widgets/dashboard")
                .then()
                .statusCode(200)
                .extract()
                .as(WidgetDataResponse.class);
    }

    /** Creates a widget and returns the updated layout. */
    public WidgetLayoutResponse createWidget(AuthContext ctx, WidgetCreateDTO dto) {
        return inWorkspace(ctx)
                .body(dto)
                .when()
                .post("/statistics/widgets")
                .then()
                .statusCode(200)
                .extract()
                .as(WidgetLayoutResponse.class);
    }

    /** Updates the widget layout order and returns the updated layout. */
    public WidgetLayoutResponse updateLayout(AuthContext ctx, UpdateLayoutRequest request) {
        return inWorkspace(ctx)
                .body(request)
                .when()
                .put("/statistics/widgets/layout")
                .then()
                .statusCode(200)
                .extract()
                .as(WidgetLayoutResponse.class);
    }

    // -------------------------------------------------------------------------
    // Error-path variants
    // -------------------------------------------------------------------------

    public ValidatableResponse getLayoutRaw(AuthContext ctx) {
        return inWorkspace(ctx).when().get("/statistics/widgets/layout").then();
    }

    public ValidatableResponse getDashboardRaw(AuthContext ctx) {
        return inWorkspace(ctx).when().get("/statistics/widgets/dashboard").then();
    }

    public ValidatableResponse getWidgetDataRaw(AuthContext ctx, long widgetId) {
        return inWorkspace(ctx).when().get("/statistics/widgets/{id}/data", widgetId).then();
    }

    /** Calls layout endpoint without any auth cookies (for 401/403 testing). */
    public ValidatableResponse getLayoutUnauthenticated() {
        return given(spec).when().get("/statistics/widgets/layout").then();
    }
}
