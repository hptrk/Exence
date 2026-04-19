package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.workspace.dto.WorkspaceMemberEmailRequest;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 11 — Audit Log
 *
 * <p>FLOW-AUDIT-01: Workspace audit log filtering and permissions
 */
class AuditLogFlowIT extends BaseFlowIT {

    @Test
    void flowAudit01_filteringAndPermissions() {
        // 1-2. UserA and UserB register
        AuthContext userA = authActor().registerVerifiedUser();
        AuthContext userB = authActor().registerVerifiedUser();
        long wsId = userA.workspaceId();

        // 3. UserA adds userB as MEMBER
        workspaceActor().addMember(userA, wsId, new WorkspaceMemberEmailRequest(userB.user().email()));

        // 4-5. UserA creates a category and transaction (generates audit entries)
        var cat = categoryActor().createExpenseCategory(userA);
        transactionActor().createTransaction(userA, ITFixtures.transaction(cat.id()).build());

        // 6. UserA: GET /audit-logs → paginated list, at least 2 entries
        var logs = auditLogActor().listAuditLogs(userA);
        assertThat(logs).hasSizeGreaterThanOrEqualTo(2);

        // 7. Filter by entityType=TRANSACTION → only transaction entries
        var txnLogs = auditLogActor().listAuditLogs(userA, "TRANSACTION", null);
        assertThat(txnLogs).isNotEmpty();
        assertThat(txnLogs.stream().allMatch(l -> "TRANSACTION".equals(l.entityType()))).isTrue();

        // 8. Filter by changeType=CREATE → only creation events
        var createLogs = auditLogActor().listAuditLogs(userA, null, "CREATE");
        assertThat(createLogs).isNotEmpty();

        // 9. UserB (MEMBER) → 403 (owner-only)
        AuthContext userBInWsA = userB.withWorkspace(wsId);
        auditLogActor().listAuditLogsRaw(userBInWsA)
                .statusCode(403);

        // 10. Unauthenticated → 401
        auditLogActor().listAuditLogsUnauthenticated()
                .statusCode(401);
    }
}
