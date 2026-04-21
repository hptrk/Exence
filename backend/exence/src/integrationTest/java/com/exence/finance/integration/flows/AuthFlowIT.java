package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 1 — Auth & Account Management
 *
 * <p>FLOW-AUTH-01: Full registration and email verification onboarding
 * <p>FLOW-AUTH-02: Full password reset cycle
 * <p>FLOW-AUTH-03: Forced re-login on all devices after password change
 * <p>FLOW-AUTH-04: Account deletion and cascade effect
 * <p>FLOW-AUTH-05: Token refresh and expiration handling
 */
class AuthFlowIT extends BaseFlowIT {

    @Test
    void flowAuth01_registrationAndVerificationOnboarding() {
        // 1. Register unverified user
        AuthContext user = authActor().registerUser();
        String email = user.user().email();

        // 2. GET /user → isVerified = false
        assertThat(userActor().getUser(user).isVerified()).isFalse();

        // 3. POST /user/request-verify-email → 204
        userActor().requestVerifyEmail(user);

        // 4. Second request while not yet verified → still succeeds (no rate-limit on unverified users)
        userActor().requestVerifyEmail(user);

        // 5-6. Extract latest token from DB and verify email
        String token = authActor().extractVerifyToken(email);
        authActor().verifyEmail(token);

        // 7. GET /user → isVerified = true
        assertThat(userActor().getUser(user).isVerified()).isTrue();

        // 8. Re-using the same token → 403 INVALID_TOKEN (token revoked after use)
        authActor().verifyEmailRaw(token).statusCode(403).body("code", equalTo("invalid-token"));
    }

    @Test
    void flowAuth02_fullPasswordResetCycle() {
        // 1. Register and verify
        AuthContext userA = authActor().registerVerifiedUser();
        String email = userA.user().email();

        // 2. Login from a second "device"
        AuthContext deviceB = authActor().loginWithUserAgent(email, "Password123!", "DeviceB/1.0");

        // 3. POST /auth/forgot-password → 204
        authActor().forgotPassword(email);

        // 4. Second forgot-password immediately → 429 TOO_MANY_EMAILS (rate-limited)
        authActor().forgotPasswordRaw(email).statusCode(429).body("code", equalTo("too-many-emails"));

        // 5-6. Extract reset token from DB and reset password
        String resetToken = authActor().extractResetToken(email);
        authActor().resetPassword(resetToken, "NewPassword789!");

        // 7. Original session's access token is revoked
        userActor().getUserRaw(userA.cookies()).statusCode(401);

        // 8. Second device session is also revoked (all sessions invalidated on password reset)
        userActor().getUserRaw(deviceB.cookies()).statusCode(401);

        // 9. Login with OLD password → 401 AUTHENTICATION_FAILED
        authActor().loginRaw(email, "Password123!").statusCode(401);

        // 10. Login with NEW password → 200
        AuthContext renewed = authActor().login(email, "NewPassword789!");
        assertThat(renewed.user().email()).isEqualTo(email);
    }

    @Test
    void flowAuth03_forcedReLoginAfterPasswordChange() {
        // 1. Register and verify
        AuthContext userA = authActor().registerVerifiedUser();
        String email = userA.user().email();

        // 2-3. Login from two devices
        AuthContext deviceA = authActor().loginWithUserAgent(email, "Password123!", "DeviceA/1.0");
        AuthContext deviceB = authActor().loginWithUserAgent(email, "Password123!", "DeviceB/1.0");

        // 4. GET /sessions from Device-A → 2+ sessions, current one marked
        var sessions = sessionActor().listSessions(deviceA);
        assertThat(sessions).hasSizeGreaterThanOrEqualTo(2);
        assertThat(sessions.stream().anyMatch(s -> s.isCurrentSession())).isTrue();

        // 5. Change password from Device-A → 204
        userActor().changePassword(deviceA, ITFixtures.changePassword().build());

        // 6. Device-A session revoked
        userActor().getUserRaw(deviceA.cookies()).statusCode(401);

        // 7. Device-B session revoked
        userActor().getUserRaw(deviceB.cookies()).statusCode(401);

        // 8. Login with new password → 200
        AuthContext renewed = authActor().login(email, "NewPassword456!");
        assertThat(renewed.user().email()).isEqualTo(email);

        // 9. Try changing to the same password (matches history) → 400 INVALID_PASSWORD
        userActor()
                .changePasswordRaw(
                        renewed,
                        ITFixtures.changePassword()
                                .oldPassword("NewPassword456!")
                                .newPassword("NewPassword456!")
                                .confirmNewPassword("NewPassword456!")
                                .build())
                .statusCode(400)
                .body("code", equalTo("invalid-password"));
    }

    @Test
    void flowAuth04_accountDeletionCascadeEffect() {
        // 1. Register and verify
        AuthContext user = authActor().registerVerifiedUser();
        String email = user.user().email();

        // 2. Create an extra workspace
        workspaceActor().createWorkspace(user, ITFixtures.workspace().build());

        // 3. Verify 2 workspaces exist
        assertThat(workspaceActor().listWorkspaces(user)).hasSize(2);

        // 4. Delete account → 204
        userActor().deleteUser(user);

        // 5. Login with same email → 401 AUTHENTICATION_FAILED
        authActor().loginRaw(email, "Password123!").statusCode(401).body("code", equalTo("authentication-failed"));

        // 6. Access with previous access token → 401
        userActor().getUserRaw(user.cookies()).statusCode(401);
    }
}
