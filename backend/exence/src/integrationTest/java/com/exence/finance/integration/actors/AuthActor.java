package com.exence.finance.integration.actors;

import static io.restassured.RestAssured.given;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.auth.dto.request.EmailVerificationRequest;
import com.exence.finance.modules.auth.dto.request.ForgotPasswordRequest;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.PasswordResetRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import io.restassured.config.RestAssuredConfig;
import io.restassured.http.Cookies;
import io.restassured.response.Response;
import io.restassured.response.ValidatableResponse;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Domain DSL for authentication operations.
 *
 * <p>Encapsulates RestAssured calls for: register, login, email verification,
 * token refresh, logout, and password management.
 */
public class AuthActor extends BaseActor {

    private final JdbcTemplate jdbcTemplate;

    public AuthActor(RestAssuredConfig config, JdbcTemplate jdbcTemplate) {
        super(config);
        this.jdbcTemplate = jdbcTemplate;
    }

    /** Registers a new user with a random unique email and returns the auth context. */
    public AuthContext registerUser() {
        String uid = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        RegisterRequest request = new RegisterRequest(
                "User" + uid,
                uid + "@test.com",
                "Password123!",
                "Password123!",
                SupportedCurrency.HUF,
                "Workspace " + uid);
        return doRegister(request);
    }

    /** Registers a new user and bypasses email verification directly in the database. */
    public AuthContext registerVerifiedUser() {
        AuthContext ctx = registerUser();
        jdbcTemplate.update(
                "UPDATE _user SET email_verified = true WHERE email = ?",
                ctx.user().email());
        return ctx;
    }

    /** Logs in with the given credentials. */
    public AuthContext login(String email, String password) {
        return doLogin(email, password);
    }

    /** Logs in from a simulated device with a custom User-Agent (creates a separate session). */
    public AuthContext loginWithUserAgent(String email, String password, String userAgent) {
        Response response = given(spec)
                .header("User-Agent", userAgent)
                .body(new LoginRequest(email, password))
                .when()
                .post("/auth/login");
        response.then().statusCode(200);
        Cookies cookies = response.getDetailedCookies();
        AuthenticationResponse body = response.as(AuthenticationResponse.class);
        return new AuthContext(cookies, body.workspaceId(), body.user());
    }

    /** Logs in as the pre-seeded admin user (winston@exence.com / Password123!). */
    public AuthContext loginAsAdmin() {
        return doLogin("winston@exence.com", "Password123!");
    }

    /** Invalidates the current session by calling the logout endpoint. */
    public void logout(AuthContext ctx) {
        given(spec).cookies(ctx.cookies()).when().post("/auth/logout").then().statusCode(200);
    }

    /** Verifies the user's email using the given token. */
    public void verifyEmail(String token) {
        given(spec)
                .body(new EmailVerificationRequest(token))
                .when()
                .post("/auth/verify-email")
                .then()
                .statusCode(204);
    }

    /** Sends a password reset request for the given email. */
    public void forgotPassword(String email) {
        given(spec)
                .body(new ForgotPasswordRequest(email))
                .when()
                .post("/auth/forgot-password")
                .then()
                .statusCode(204);
    }

    /** Resets the user's password using the given reset token. */
    public void resetPassword(String token, String newPassword) {
        given(spec)
                .body(new PasswordResetRequest(token, newPassword, newPassword))
                .when()
                .post("/auth/reset-password")
                .then()
                .statusCode(204);
    }

    /**
     * Exchanges the current refresh token for a new access + refresh token pair.
     * Returns a new AuthContext with the updated cookies.
     */
    public AuthContext refreshToken(AuthContext ctx) {
        Response response = given(spec).cookies(ctx.cookies()).when().post("/auth/refresh-token");
        response.then().statusCode(204);
        return new AuthContext(response.getDetailedCookies(), ctx.workspaceId(), ctx.user());
    }

    /** Extracts the latest unused email-verification token for the given email from the DB. */
    public String extractVerifyToken(String email) {
        return jdbcTemplate.queryForObject(
                "SELECT t.token_value FROM token t "
                        + "JOIN _user u ON t.user_id = u.id "
                        + "WHERE u.email = ? AND t.token_type = 'EMAIL_VERIFICATION' AND t.revoked = false "
                        + "ORDER BY t.created_at DESC LIMIT 1",
                String.class,
                email);
    }

    /** Extracts the latest unused password-reset token for the given email from the DB. */
    public String extractResetToken(String email) {
        return jdbcTemplate.queryForObject(
                "SELECT t.token_value FROM token t "
                        + "JOIN _user u ON t.user_id = u.id "
                        + "WHERE u.email = ? AND t.token_type = 'PASSWORD_RESET' AND t.revoked = false "
                        + "ORDER BY t.created_at DESC LIMIT 1",
                String.class,
                email);
    }

    // -------------------------------------------------------------------------
    // Error-path variants — callers assert statusCode + error code body
    // -------------------------------------------------------------------------

    public ValidatableResponse verifyEmailRaw(String token) {
        return given(spec)
                .body(new EmailVerificationRequest(token))
                .when()
                .post("/auth/verify-email")
                .then();
    }

    public ValidatableResponse refreshTokenRaw(Cookies cookies) {
        return given(spec).cookies(cookies).when().post("/auth/refresh-token").then();
    }

    public ValidatableResponse loginRaw(String email, String password) {
        return given(spec)
                .body(new LoginRequest(email, password))
                .when()
                .post("/auth/login")
                .then();
    }

    public ValidatableResponse forgotPasswordRaw(String email) {
        return given(spec)
                .body(new ForgotPasswordRequest(email))
                .when()
                .post("/auth/forgot-password")
                .then();
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private AuthContext doRegister(RegisterRequest request) {
        Response response = given(spec).body(request).when().post("/auth/register");
        response.then().statusCode(200);
        Cookies cookies = response.getDetailedCookies();
        AuthenticationResponse body = response.as(AuthenticationResponse.class);
        return new AuthContext(cookies, body.workspaceId(), body.user());
    }

    private AuthContext doLogin(String email, String password) {
        Response response =
                given(spec).body(new LoginRequest(email, password)).when().post("/auth/login");
        response.then().statusCode(200);
        Cookies cookies = response.getDetailedCookies();
        AuthenticationResponse body = response.as(AuthenticationResponse.class);
        return new AuthContext(cookies, body.workspaceId(), body.user());
    }
}
