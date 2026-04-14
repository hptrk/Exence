package com.exence.finance.modules.auditlog.enums;

import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.debt.entity.Debt;
import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.investment.entity.Investment;
import com.exence.finance.modules.transaction.entity.RecurringTransaction;
import com.exence.finance.modules.transaction.entity.Transaction;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AuditableEntityType {
    TRANSACTION(Transaction.class),
    CATEGORY(Category.class),
    GOAL(Goal.class),
    DEBT(Debt.class),
    INVESTMENT(Investment.class),
    RECURRING_TRANSACTION(RecurringTransaction.class),
    WORKSPACE(Workspace.class),
    WORKSPACE_MEMBER(WorkspaceMember.class);

    private final Class<?> entityClass;
}
