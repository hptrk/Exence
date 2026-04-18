package com.exence.finance.common;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.category.dto.CategoryCreateDTO;
import com.exence.finance.modules.category.dto.CategoryPatchDTO;
import com.exence.finance.modules.category.dto.CategoryType;
import com.exence.finance.modules.category.dto.MaterialIcon;
import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtPatchDTO;
import com.exence.finance.modules.debt.dto.DebtPaymentDTO;
import com.exence.finance.modules.debt.enums.DebtType;
import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.dto.GoalPatchDTO;
import com.exence.finance.modules.investment.dto.InvestmentCreateDTO;
import com.exence.finance.modules.investment.dto.InvestmentPatchDTO;
import com.exence.finance.modules.investment.enums.InvestmentType;
import com.exence.finance.modules.transaction.dto.EndCondition;
import com.exence.finance.modules.transaction.dto.RecurrenceFrequency;
import com.exence.finance.modules.transaction.dto.RecurringTransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.TransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.TransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.workspace.dto.WorkspaceCreateRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceRenameRequest;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsPatchRequest;
import java.math.BigDecimal;
import java.time.LocalDate;

public final class ITFixtures {

    private ITFixtures() {}

    // --- Categories ---

    public static CategoryCreateDTO expenseCategoryRequest() {
        return new CategoryCreateDTO(
                "Groceries", MaterialIcon.LOCAL_GROCERY_STORE, "#FF5722", CategoryType.EXPENSE, "Weekly food shopping");
    }

    public static CategoryCreateDTO incomeCategoryRequest() {
        return new CategoryCreateDTO("Salary", MaterialIcon.WORK, "#4CAF50", CategoryType.INCOME, null);
    }

    public static CategoryPatchDTO categoryPatchRequest() {
        return new CategoryPatchDTO("Updated Groceries", null, null, null, "Updated note");
    }

    // --- Transactions ---

    public static TransactionCreateDTO transactionCreateRequest(Long categoryId) {
        return new TransactionCreateDTO(
                "Grocery shopping",
                "Weekly food run",
                LocalDate.of(2026, 1, 15),
                new BigDecimal("5000.00"),
                TransactionType.EXPENSE,
                categoryId,
                SupportedCurrency.HUF,
                null);
    }

    public static TransactionPatchDTO transactionPatchRequest() {
        return new TransactionPatchDTO(
                "Updated grocery shopping", null, null, new BigDecimal("6000.00"), null, null, null, null);
    }

    // --- Recurring transactions ---

    public static RecurringTransactionCreateDTO recurringTransactionRequest(Long categoryId) {
        return new RecurringTransactionCreateDTO(
                "Netflix",
                "Monthly streaming subscription",
                new BigDecimal("4500.00"),
                TransactionType.EXPENSE,
                categoryId,
                SupportedCurrency.HUF,
                RecurrenceFrequency.MONTHLY,
                1,
                null,
                15,
                EndCondition.UNTIL_DATE,
                LocalDate.of(2027, 12, 31),
                null,
                LocalDate.of(2026, 1, 15));
    }

    // --- Debts ---

    public static DebtCreateDTO debtCreateRequest(Long categoryId) {
        return new DebtCreateDTO(
                "Car Loan",
                "Alice Smith",
                new BigDecimal("500000.00"),
                SupportedCurrency.HUF,
                LocalDate.of(2027, 6, 30),
                DebtType.BORROWED,
                categoryId);
    }

    public static DebtPatchDTO debtPatchRequest() {
        return new DebtPatchDTO("Updated Car Loan", null, null, null, null, null);
    }

    public static DebtPaymentDTO debtPaymentRequest() {
        return new DebtPaymentDTO(new BigDecimal("50000.00"));
    }

    // --- Goals ---

    public static GoalCreateDTO goalCreateRequest(Long categoryId) {
        return new GoalCreateDTO(
                "Vacation Fund",
                "Saving for a trip to Hawaii",
                new BigDecimal("500000.00"),
                new BigDecimal("50000.00"),
                SupportedCurrency.HUF,
                LocalDate.of(2027, 12, 31),
                categoryId);
    }

    public static GoalPatchDTO goalPatchRequest() {
        return new GoalPatchDTO("Updated Vacation Fund", null, null, null, null, null, null);
    }

    // --- Investments ---

    public static InvestmentCreateDTO investmentCreateRequest() {
        return new InvestmentCreateDTO(
                "Bitcoin",
                LocalDate.of(2026, 1, 10),
                InvestmentType.CRYPTO,
                new BigDecimal("500000.00"),
                SupportedCurrency.HUF,
                "Long-term hold");
    }

    public static InvestmentPatchDTO investmentPatchRequest() {
        return new InvestmentPatchDTO("Ethereum", null, null, null, "Switched to Ethereum");
    }

    // --- Workspaces ---

    public static WorkspaceCreateRequest workspaceCreateRequest() {
        return new WorkspaceCreateRequest("My Second Workspace", SupportedCurrency.EUR);
    }

    public static WorkspaceRenameRequest workspaceRenameRequest() {
        return new WorkspaceRenameRequest("Renamed Workspace");
    }

    public static WorkspaceSettingsPatchRequest workspaceSettingsPatchRequest() {
        return new WorkspaceSettingsPatchRequest(SupportedCurrency.EUR, true);
    }
}
