package com.exence.finance.integration.setup;

import com.exence.finance.integration.actors.AchievementActor;
import com.exence.finance.integration.actors.AdminActor;
import com.exence.finance.integration.actors.AuditLogActor;
import com.exence.finance.integration.actors.AuthActor;
import com.exence.finance.integration.actors.CategoryActor;
import com.exence.finance.integration.actors.DebtActor;
import com.exence.finance.integration.actors.GoalActor;
import com.exence.finance.integration.actors.InvestmentActor;
import com.exence.finance.integration.actors.SessionActor;
import com.exence.finance.integration.actors.TransactionActor;
import com.exence.finance.integration.actors.UserActor;
import com.exence.finance.integration.actors.UserSettingsActor;
import com.exence.finance.integration.actors.WidgetActor;
import com.exence.finance.integration.actors.WorkspaceActor;

/**
 * Base class for all integration flow tests.
 *
 * <p>Flow classes extend this and use the actor factory methods to obtain domain-specific
 * DSL objects. Each actor encapsulates RestAssured calls so flows read like user stories:
 *
 * <pre>{@code
 * AuthContext user = authActor().registerVerifiedUser();
 * long categoryId = categoryActor().createExpenseCategory(user).id();
 * transactionActor().createTransaction(user, ITFixtures.transaction(categoryId).build());
 * }</pre>
 *
 * <p>Parallel execution: classes run concurrently (configured via junit-platform.properties),
 * but methods within a single flow class run sequentially (SAME_THREAD) so that user story
 * steps execute in the declared order without shared-state conflicts.
 */
public abstract class BaseFlowIT extends AbstractIT {

    protected AuthActor authActor() {
        return new AuthActor(restAssuredConfig(), jdbcTemplate);
    }

    protected UserActor userActor() {
        return new UserActor(restAssuredConfig());
    }

    protected CategoryActor categoryActor() {
        return new CategoryActor(restAssuredConfig());
    }

    protected TransactionActor transactionActor() {
        return new TransactionActor(restAssuredConfig());
    }

    protected DebtActor debtActor() {
        return new DebtActor(restAssuredConfig());
    }

    protected GoalActor goalActor() {
        return new GoalActor(restAssuredConfig());
    }

    protected WorkspaceActor workspaceActor() {
        return new WorkspaceActor(restAssuredConfig());
    }

    protected InvestmentActor investmentActor() {
        return new InvestmentActor(restAssuredConfig());
    }

    protected WidgetActor widgetActor() {
        return new WidgetActor(restAssuredConfig());
    }

    protected AchievementActor achievementActor() {
        return new AchievementActor(restAssuredConfig());
    }

    protected SessionActor sessionActor() {
        return new SessionActor(restAssuredConfig());
    }

    protected UserSettingsActor userSettingsActor() {
        return new UserSettingsActor(restAssuredConfig());
    }

    protected AuditLogActor auditLogActor() {
        return new AuditLogActor(restAssuredConfig());
    }

    protected AdminActor adminActor() {
        return new AdminActor(restAssuredConfig());
    }
}
