package com.exence.finance.integration.actors;

import static io.restassured.RestAssured.given;

import com.exence.finance.integration.setup.AuthContext;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.config.RestAssuredConfig;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;

/**
 * Base class for all test actors.
 *
 * <p>Provides common setup for RestAssured RequestSpecification with content type
 * and utilities for authenticating requests with workspace context.
 */
public abstract class BaseActor {

    protected final RequestSpecification spec;

    protected BaseActor(RestAssuredConfig config) {
        this.spec = new RequestSpecBuilder()
                .setContentType(ContentType.JSON)
                .setConfig(config)
                .build();
    }

    /**
     * Builds a request specification with authentication cookies and workspace header.
     *
     * @param ctx the authentication context containing cookies and workspace ID
     * @return a RequestSpecification configured for the given context
     */
    protected RequestSpecification inWorkspace(AuthContext ctx) {
        return given(spec).cookies(ctx.cookies()).header("X-Workspace-ID", ctx.workspaceId());
    }
}
