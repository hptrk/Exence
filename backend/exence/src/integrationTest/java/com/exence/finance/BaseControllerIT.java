package com.exence.finance;

import static io.restassured.RestAssured.given;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.RestAssured;
import io.restassured.config.ObjectMapperConfig;
import io.restassured.config.RestAssuredConfig;
import io.restassured.http.ContentType;
import io.restassured.http.Cookies;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;

public abstract class BaseControllerIT extends AbstractIT {

    static final String WORKSPACE_HEADER = "X-Workspace-ID";

    @LocalServerPort
    private int port;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void baseSetUp() {
        RestAssured.port = port;
        RestAssured.basePath = "/api";
        RestAssured.config = RestAssuredConfig.config()
                .objectMapperConfig(ObjectMapperConfig.objectMapperConfig()
                        .jackson2ObjectMapperFactory((cls, charset) -> objectMapper));
    }

    public record AuthContext(Cookies cookies, Long workspaceId, UserGetDTO user) {}

    protected AuthContext registerUser() {
        String email = "user-" + UUID.randomUUID() + "@test.com";
        String username = "user" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        var request = new RegisterRequest(
                username, email, "Password123!", "Password123!", SupportedCurrency.HUF, "Test Workspace");

        Response response = given().contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/auth/register")
                .then()
                .statusCode(200)
                .extract()
                .response();

        AuthenticationResponse body = response.as(AuthenticationResponse.class);
        return new AuthContext(response.detailedCookies(), body.workspaceId(), body.user());
    }

    protected AuthContext registerVerifiedUser() {
        AuthContext ctx = registerUser();
        jdbcTemplate.update(
                "UPDATE _user SET email_verified = true WHERE id = ?",
                ctx.user().id());
        return ctx;
    }

    // Logs in as the pre-seeded admin (winston@exence.com) from test-data.yaml.
    // Fetches their first workspace so workspace-aware calls work too.
    protected AuthContext loginAsExistingAdmin() {
        var loginRequest = new LoginRequest("winston@exence.com", "Password123!");

        Response loginResponse = given().contentType(ContentType.JSON)
                .body(loginRequest)
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200)
                .extract()
                .response();

        AuthenticationResponse loginBody = loginResponse.as(AuthenticationResponse.class);
        Cookies adminCookies = loginResponse.detailedCookies();

        // Fetch workspace for admin so workspace-scoped helpers work
        var workspaces = given().cookies(adminCookies)
                .when()
                .get("/workspaces")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("id", Long.class);

        Long workspaceId = workspaces.isEmpty() ? null : workspaces.get(0);
        return new AuthContext(adminCookies, workspaceId, loginBody.user());
    }

    // RequestSpecification with cookies AND workspace header (most workspace-aware endpoints).
    protected RequestSpecification asUser(AuthContext ctx) {
        return given().cookies(ctx.cookies())
                .header(WORKSPACE_HEADER, ctx.workspaceId())
                .contentType(ContentType.JSON);
    }

    // RequestSpecification with cookies only (sessions, user profile – no workspace context).
    protected RequestSpecification withCookies(AuthContext ctx) {
        return given().cookies(ctx.cookies()).contentType(ContentType.JSON);
    }

    // Admin endpoints don't require workspace header (excluded in WorkspaceInterceptor).
    protected RequestSpecification asAdmin(AuthContext adminCtx) {
        return given().cookies(adminCtx.cookies()).contentType(ContentType.JSON);
    }

    protected RequestSpecification unauthenticated() {
        return given().contentType(ContentType.JSON);
    }
}
