package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.goal.enums.GoalStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 7 — Goals
 *
 * <p>FLOW-GOAL-01: Goal lifecycle and automatic status transition
 * <p>FLOW-GOAL-02: Instant completion and widget data
 * <p>FLOW-GOAL-03: Email verification barrier in Goals module
 */
class GoalFlowIT extends BaseFlowIT {

    @Test
    void flowGoal01_lifecycleAndStatusTransition() {
        AuthContext user = authActor().registerVerifiedUser();
        var cat = categoryActor().createExpenseCategory(user);

        // 3. Create goal targetAmount=1000, initialAmount=0 → ACTIVE
        var goal = goalActor().createGoal(user,
                ITFixtures.goal(cat.id())
                        .targetAmount(new BigDecimal("1000"))
                        .currentAmount(BigDecimal.ZERO)
                        .deadline(LocalDate.now().plusYears(1))
                        .build());
        assertThat(goal.status()).isEqualTo(GoalStatus.ACTIVE);

        // 4. List goals → 1 goal, ACTIVE
        assertThat(goalActor().listGoals(user)).hasSize(1);

        // 5. Filter by COMPLETED → empty
        assertThat(goalActor().listGoals(user, GoalStatus.COMPLETED)).isEmpty();

        // 6. PATCH currentAmount=400 → ACTIVE (target not reached)
        var partial = goalActor().patchGoal(user, goal.id(),
                ITFixtures.goalPatch().currentAmount(new BigDecimal("400")).build());
        assertThat(partial.status()).isEqualTo(GoalStatus.ACTIVE);

        // 7. PATCH currentAmount=1000 → COMPLETED (target reached)
        var completed = goalActor().patchGoal(user, goal.id(),
                ITFixtures.goalPatch().currentAmount(new BigDecimal("1000")).build());
        assertThat(completed.status()).isEqualTo(GoalStatus.COMPLETED);

        // 8. Filter by ACTIVE → empty
        assertThat(goalActor().listGoals(user, GoalStatus.ACTIVE)).isEmpty();

        // 9. Filter by COMPLETED → 1 goal
        assertThat(goalActor().listGoals(user, GoalStatus.COMPLETED)).hasSize(1);

        // 10. Revert to ACTIVE
        var reverted = goalActor().patchGoal(user, goal.id(),
                ITFixtures.goalPatch().status(GoalStatus.ACTIVE).build());
        assertThat(reverted.status()).isEqualTo(GoalStatus.ACTIVE);

        // 11. DELETE goal → 204
        goalActor().deleteGoal(user, goal.id());

        // 12. GET deleted goal → 404
        goalActor().getGoalRaw(user, goal.id())
                .statusCode(404)
                .body("code", equalTo("goal-not-found"));
    }

    @Test
    void flowGoal02_instantCompletionAndWidgetData() {
        AuthContext user = authActor().registerVerifiedUser();
        var cat = categoryActor().createExpenseCategory(user);

        // 3. targetAmount=500, initialAmount=500 → COMPLETED immediately
        var g1 = goalActor().createGoal(user,
                ITFixtures.goal(cat.id())
                        .targetAmount(new BigDecimal("500"))
                        .currentAmount(new BigDecimal("500"))
                        .build());
        assertThat(g1.status()).isEqualTo(GoalStatus.COMPLETED);

        // 4. targetAmount=500, initialAmount=600 → COMPLETED (overshoot)
        var g2 = goalActor().createGoal(user,
                ITFixtures.goal(cat.id())
                        .title("Overshoot Goal")
                        .targetAmount(new BigDecimal("500"))
                        .currentAmount(new BigDecimal("600"))
                        .build());
        assertThat(g2.status()).isEqualTo(GoalStatus.COMPLETED);

        // 5. Active goal with deadline
        var g3 = goalActor().createGoal(user,
                ITFixtures.goal(cat.id())
                        .title("Active Goal")
                        .targetAmount(new BigDecimal("1000"))
                        .currentAmount(new BigDecimal("200"))
                        .deadline(LocalDate.now().plusMonths(6))
                        .build());
        assertThat(g3.status()).isEqualTo(GoalStatus.ACTIVE);

        // 6. List → 3 goals
        assertThat(goalActor().listGoals(user)).hasSize(3);

        // 7. Widget summary data
        goalActor().getWidgetDataRaw(user, "GOAL_SUMMARY").statusCode(200);

        // 8. Widget progress data for active goal
        goalActor().getWidgetDataRaw(user, "GOAL_PROGRESS", g3.id()).statusCode(200);

        // 9. Pause active goal → PAUSED
        var paused = goalActor().patchGoal(user, g3.id(),
                ITFixtures.goalPatch().status(GoalStatus.PAUSED).build());
        assertThat(paused.status()).isEqualTo(GoalStatus.PAUSED);

        // 10. Filter by PAUSED → 1 goal
        assertThat(goalActor().listGoals(user, GoalStatus.PAUSED)).hasSize(1);
    }

    @Test
    void flowGoal03_emailVerificationBarrier() {
        // 1. Register WITHOUT email verification
        AuthContext unverified = authActor().registerUser();
        var cat = categoryActor().createExpenseCategory(unverified);

        // 2. POST /goals → 403 EMAIL_VERIFICATION_REQUIRED
        goalActor().createGoalRaw(unverified, ITFixtures.goal(cat.id()).build())
                .statusCode(403)
                .body("code", equalTo("email-verification-required"));

        // 3. GET /goals → 403
        goalActor().listGoalsRaw(unverified)
                .statusCode(403)
                .body("code", equalTo("email-verification-required"));

        // 4. Verify email
        String token = authActor().extractVerifyToken(unverified.user().email());
        authActor().verifyEmail(token);

        // 5-6. Now goals work
        var goal = goalActor().createGoal(unverified, ITFixtures.goal(cat.id()).build());
        assertThat(goal.id()).isPositive();
    }
}
