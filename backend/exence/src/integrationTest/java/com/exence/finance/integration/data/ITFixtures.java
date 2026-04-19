package com.exence.finance.integration.data;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.auth.dto.UserPatchDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.category.dto.CategoryCreateDTO;
import com.exence.finance.modules.category.dto.CategoryPatchDTO;
import com.exence.finance.modules.category.dto.CategoryType;
import com.exence.finance.modules.category.dto.MaterialIcon;
import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtPatchDTO;
import com.exence.finance.modules.debt.dto.DebtPaymentDTO;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.dto.GoalPatchDTO;
import com.exence.finance.modules.goal.enums.GoalStatus;
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
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Fluent test data builders for integration tests.
 *
 * <p>Each factory method returns a pre-filled builder with sensible defaults.
 * Override only what the test cares about:
 *
 * <pre>{@code
 * // Use defaults
 * ITFixtures.expenseCategory().build();
 *
 * // Override specific fields
 * ITFixtures.expenseCategory().name("Travel").color("#0000FF").build();
 * }</pre>
 */
public final class ITFixtures {

    private ITFixtures() {}

    // -------------------------------------------------------------------------
    // Categories
    // -------------------------------------------------------------------------

    public static CategoryBuilder expenseCategory() {
        return new CategoryBuilder()
                .name("Groceries")
                .icon(MaterialIcon.LOCAL_GROCERY_STORE)
                .color("#FF5722")
                .type(CategoryType.EXPENSE)
                .note("Weekly food shopping");
    }

    public static CategoryBuilder incomeCategory() {
        return new CategoryBuilder()
                .name("Salary")
                .icon(MaterialIcon.WORK)
                .color("#4CAF50")
                .type(CategoryType.INCOME)
                .note(null);
    }

    public static CategoryPatchBuilder categoryPatch() {
        return new CategoryPatchBuilder().name("Updated Groceries").note("Updated note");
    }

    public static final class CategoryBuilder {
        private String name;
        private MaterialIcon icon;
        private String color;
        private CategoryType type;
        private String note;

        public CategoryBuilder name(String v) {
            this.name = v;
            return this;
        }

        public CategoryBuilder icon(MaterialIcon v) {
            this.icon = v;
            return this;
        }

        public CategoryBuilder color(String v) {
            this.color = v;
            return this;
        }

        public CategoryBuilder type(CategoryType v) {
            this.type = v;
            return this;
        }

        public CategoryBuilder note(String v) {
            this.note = v;
            return this;
        }

        public CategoryCreateDTO build() {
            return new CategoryCreateDTO(name, icon, color, type, note);
        }
    }

    public static final class CategoryPatchBuilder {
        private String name;
        private MaterialIcon icon;
        private String color;
        private CategoryType type;
        private String note;

        public CategoryPatchBuilder name(String v) {
            this.name = v;
            return this;
        }

        public CategoryPatchBuilder icon(MaterialIcon v) {
            this.icon = v;
            return this;
        }

        public CategoryPatchBuilder color(String v) {
            this.color = v;
            return this;
        }

        public CategoryPatchBuilder type(CategoryType v) {
            this.type = v;
            return this;
        }

        public CategoryPatchBuilder note(String v) {
            this.note = v;
            return this;
        }

        public CategoryPatchDTO build() {
            return new CategoryPatchDTO(name, icon, color, type, note);
        }
    }

    // -------------------------------------------------------------------------
    // Transactions
    // Record fields: title, note, date, amount, type, categoryId, currency, exchangeRate
    // -------------------------------------------------------------------------

    public static TransactionBuilder transaction(Long categoryId) {
        return new TransactionBuilder()
                .title("Grocery shopping")
                .note("Weekly food run")
                .date(LocalDate.of(2026, 1, 15))
                .amount(new BigDecimal("5000.00"))
                .type(TransactionType.EXPENSE)
                .categoryId(categoryId)
                .currency(SupportedCurrency.HUF)
                .exchangeRate(null);
    }

    public static TransactionPatchBuilder transactionPatch() {
        return new TransactionPatchBuilder().title("Updated grocery shopping").amount(new BigDecimal("6000.00"));
    }

    public static final class TransactionBuilder {
        private String title;
        private String note;
        private LocalDate date;
        private BigDecimal amount;
        private TransactionType type;
        private Long categoryId;
        private SupportedCurrency currency;
        private BigDecimal exchangeRate;

        public TransactionBuilder title(String v) {
            this.title = v;
            return this;
        }

        public TransactionBuilder note(String v) {
            this.note = v;
            return this;
        }

        public TransactionBuilder date(LocalDate v) {
            this.date = v;
            return this;
        }

        public TransactionBuilder amount(BigDecimal v) {
            this.amount = v;
            return this;
        }

        public TransactionBuilder type(TransactionType v) {
            this.type = v;
            return this;
        }

        public TransactionBuilder categoryId(Long v) {
            this.categoryId = v;
            return this;
        }

        public TransactionBuilder currency(SupportedCurrency v) {
            this.currency = v;
            return this;
        }

        public TransactionBuilder exchangeRate(BigDecimal v) {
            this.exchangeRate = v;
            return this;
        }

        public TransactionCreateDTO build() {
            return new TransactionCreateDTO(title, note, date, amount, type, categoryId, currency, exchangeRate);
        }
    }

    public static final class TransactionPatchBuilder {
        private String title;
        private String note;
        private LocalDate date;
        private BigDecimal amount;
        private TransactionType type;
        private Long categoryId;
        private SupportedCurrency currency;
        private BigDecimal exchangeRate;

        public TransactionPatchBuilder title(String v) {
            this.title = v;
            return this;
        }

        public TransactionPatchBuilder note(String v) {
            this.note = v;
            return this;
        }

        public TransactionPatchBuilder date(LocalDate v) {
            this.date = v;
            return this;
        }

        public TransactionPatchBuilder amount(BigDecimal v) {
            this.amount = v;
            return this;
        }

        public TransactionPatchBuilder type(TransactionType v) {
            this.type = v;
            return this;
        }

        public TransactionPatchBuilder categoryId(Long v) {
            this.categoryId = v;
            return this;
        }

        public TransactionPatchBuilder currency(SupportedCurrency v) {
            this.currency = v;
            return this;
        }

        public TransactionPatchBuilder exchangeRate(BigDecimal v) {
            this.exchangeRate = v;
            return this;
        }

        public TransactionPatchDTO build() {
            return new TransactionPatchDTO(title, note, date, amount, type, categoryId, currency, exchangeRate);
        }
    }

    // -------------------------------------------------------------------------
    // Recurring transactions
    // Record fields: title, note, amount, type, categoryId, currency, frequency,
    //                interval, dayOfWeek, dayOfMonth, endCondition, endDate,
    //                maxOccurrences, startDate
    // -------------------------------------------------------------------------

    public static RecurringTransactionBuilder recurringTransaction(Long categoryId) {
        return new RecurringTransactionBuilder()
                .title("Netflix")
                .note("Monthly streaming subscription")
                .amount(new BigDecimal("4500.00"))
                .type(TransactionType.EXPENSE)
                .categoryId(categoryId)
                .currency(SupportedCurrency.HUF)
                .frequency(RecurrenceFrequency.MONTHLY)
                .interval(1)
                .dayOfWeek(null)
                .dayOfMonth(15)
                .endCondition(EndCondition.UNTIL_DATE)
                .endDate(LocalDate.of(2027, 12, 31))
                .maxOccurrences(null)
                .startDate(LocalDate.of(2026, 1, 15));
    }

    public static final class RecurringTransactionBuilder {
        private String title;
        private String note;
        private BigDecimal amount;
        private TransactionType type;
        private Long categoryId;
        private SupportedCurrency currency;
        private RecurrenceFrequency frequency;
        private Integer interval;
        private DayOfWeek dayOfWeek;
        private Integer dayOfMonth;
        private EndCondition endCondition;
        private LocalDate endDate;
        private Integer maxOccurrences;
        private LocalDate startDate;

        public RecurringTransactionBuilder title(String v) {
            this.title = v;
            return this;
        }

        public RecurringTransactionBuilder note(String v) {
            this.note = v;
            return this;
        }

        public RecurringTransactionBuilder amount(BigDecimal v) {
            this.amount = v;
            return this;
        }

        public RecurringTransactionBuilder type(TransactionType v) {
            this.type = v;
            return this;
        }

        public RecurringTransactionBuilder categoryId(Long v) {
            this.categoryId = v;
            return this;
        }

        public RecurringTransactionBuilder currency(SupportedCurrency v) {
            this.currency = v;
            return this;
        }

        public RecurringTransactionBuilder frequency(RecurrenceFrequency v) {
            this.frequency = v;
            return this;
        }

        public RecurringTransactionBuilder interval(Integer v) {
            this.interval = v;
            return this;
        }

        public RecurringTransactionBuilder dayOfWeek(DayOfWeek v) {
            this.dayOfWeek = v;
            return this;
        }

        public RecurringTransactionBuilder dayOfMonth(Integer v) {
            this.dayOfMonth = v;
            return this;
        }

        public RecurringTransactionBuilder endCondition(EndCondition v) {
            this.endCondition = v;
            return this;
        }

        public RecurringTransactionBuilder endDate(LocalDate v) {
            this.endDate = v;
            return this;
        }

        public RecurringTransactionBuilder maxOccurrences(Integer v) {
            this.maxOccurrences = v;
            return this;
        }

        public RecurringTransactionBuilder startDate(LocalDate v) {
            this.startDate = v;
            return this;
        }

        public RecurringTransactionCreateDTO build() {
            return new RecurringTransactionCreateDTO(
                    title,
                    note,
                    amount,
                    type,
                    categoryId,
                    currency,
                    frequency,
                    interval,
                    dayOfWeek,
                    dayOfMonth,
                    endCondition,
                    endDate,
                    maxOccurrences,
                    startDate);
        }
    }

    // -------------------------------------------------------------------------
    // Debts
    // DebtCreateDTO fields: title, counterpartyName, amount, currency, deadline, type, categoryId
    // DebtPatchDTO fields:  title, counterpartyName, deadline, type, status, categoryId
    // -------------------------------------------------------------------------

    public static DebtBuilder debt(Long categoryId) {
        return new DebtBuilder()
                .title("Car Loan")
                .counterpartyName("Alice Smith")
                .amount(new BigDecimal("500000.00"))
                .currency(SupportedCurrency.HUF)
                .deadline(LocalDate.of(2027, 6, 30))
                .type(DebtType.BORROWED)
                .categoryId(categoryId);
    }

    public static DebtPatchBuilder debtPatch() {
        return new DebtPatchBuilder().title("Updated Car Loan");
    }

    public static DebtPaymentBuilder debtPayment() {
        return new DebtPaymentBuilder().amount(new BigDecimal("50000.00"));
    }

    public static final class DebtBuilder {
        private String title;
        private String counterpartyName;
        private BigDecimal amount;
        private SupportedCurrency currency;
        private LocalDate deadline;
        private DebtType type;
        private Long categoryId;

        public DebtBuilder title(String v) {
            this.title = v;
            return this;
        }

        public DebtBuilder counterpartyName(String v) {
            this.counterpartyName = v;
            return this;
        }

        public DebtBuilder amount(BigDecimal v) {
            this.amount = v;
            return this;
        }

        public DebtBuilder currency(SupportedCurrency v) {
            this.currency = v;
            return this;
        }

        public DebtBuilder deadline(LocalDate v) {
            this.deadline = v;
            return this;
        }

        public DebtBuilder type(DebtType v) {
            this.type = v;
            return this;
        }

        public DebtBuilder categoryId(Long v) {
            this.categoryId = v;
            return this;
        }

        public DebtCreateDTO build() {
            return new DebtCreateDTO(title, counterpartyName, amount, currency, deadline, type, categoryId);
        }
    }

    public static final class DebtPatchBuilder {
        private String title;
        private String counterpartyName;
        private LocalDate deadline;
        private DebtType type;
        private DebtStatus status;
        private Long categoryId;

        public DebtPatchBuilder title(String v) {
            this.title = v;
            return this;
        }

        public DebtPatchBuilder counterpartyName(String v) {
            this.counterpartyName = v;
            return this;
        }

        public DebtPatchBuilder deadline(LocalDate v) {
            this.deadline = v;
            return this;
        }

        public DebtPatchBuilder type(DebtType v) {
            this.type = v;
            return this;
        }

        public DebtPatchBuilder status(DebtStatus v) {
            this.status = v;
            return this;
        }

        public DebtPatchBuilder categoryId(Long v) {
            this.categoryId = v;
            return this;
        }

        public DebtPatchDTO build() {
            return new DebtPatchDTO(title, counterpartyName, deadline, type, status, categoryId);
        }
    }

    public static final class DebtPaymentBuilder {
        private BigDecimal amount;

        public DebtPaymentBuilder amount(BigDecimal v) {
            this.amount = v;
            return this;
        }

        public DebtPaymentDTO build() {
            return new DebtPaymentDTO(amount);
        }
    }

    // -------------------------------------------------------------------------
    // Goals
    // GoalCreateDTO fields: title, description, targetAmount, currentAmount, currency, deadline, categoryId
    // GoalPatchDTO fields:  title, description, targetAmount, currentAmount, deadline, status, categoryId
    // -------------------------------------------------------------------------

    public static GoalBuilder goal(Long categoryId) {
        return new GoalBuilder()
                .title("Vacation Fund")
                .description("Saving for a trip to Hawaii")
                .targetAmount(new BigDecimal("500000.00"))
                .currentAmount(new BigDecimal("50000.00"))
                .currency(SupportedCurrency.HUF)
                .deadline(LocalDate.of(2027, 12, 31))
                .categoryId(categoryId);
    }

    public static GoalPatchBuilder goalPatch() {
        return new GoalPatchBuilder().title("Updated Vacation Fund");
    }

    public static final class GoalBuilder {
        private String title;
        private String description;
        private BigDecimal targetAmount;
        private BigDecimal currentAmount;
        private SupportedCurrency currency;
        private LocalDate deadline;
        private Long categoryId;

        public GoalBuilder title(String v) {
            this.title = v;
            return this;
        }

        public GoalBuilder description(String v) {
            this.description = v;
            return this;
        }

        public GoalBuilder targetAmount(BigDecimal v) {
            this.targetAmount = v;
            return this;
        }

        public GoalBuilder currentAmount(BigDecimal v) {
            this.currentAmount = v;
            return this;
        }

        public GoalBuilder currency(SupportedCurrency v) {
            this.currency = v;
            return this;
        }

        public GoalBuilder deadline(LocalDate v) {
            this.deadline = v;
            return this;
        }

        public GoalBuilder categoryId(Long v) {
            this.categoryId = v;
            return this;
        }

        public GoalCreateDTO build() {
            return new GoalCreateDTO(title, description, targetAmount, currentAmount, currency, deadline, categoryId);
        }
    }

    public static final class GoalPatchBuilder {
        private String title;
        private String description;
        private BigDecimal targetAmount;
        private BigDecimal currentAmount;
        private LocalDate deadline;
        private GoalStatus status;
        private Long categoryId;

        public GoalPatchBuilder title(String v) {
            this.title = v;
            return this;
        }

        public GoalPatchBuilder description(String v) {
            this.description = v;
            return this;
        }

        public GoalPatchBuilder targetAmount(BigDecimal v) {
            this.targetAmount = v;
            return this;
        }

        public GoalPatchBuilder currentAmount(BigDecimal v) {
            this.currentAmount = v;
            return this;
        }

        public GoalPatchBuilder deadline(LocalDate v) {
            this.deadline = v;
            return this;
        }

        public GoalPatchBuilder status(GoalStatus v) {
            this.status = v;
            return this;
        }

        public GoalPatchBuilder categoryId(Long v) {
            this.categoryId = v;
            return this;
        }

        public GoalPatchDTO build() {
            return new GoalPatchDTO(title, description, targetAmount, currentAmount, deadline, status, categoryId);
        }
    }

    // -------------------------------------------------------------------------
    // Investments
    // InvestmentCreateDTO fields: asset, purchaseDate, type, amount, currency, note
    // InvestmentPatchDTO fields:  asset, purchaseDate, type, amount, note
    // -------------------------------------------------------------------------

    public static InvestmentBuilder investment() {
        return new InvestmentBuilder()
                .asset("Bitcoin")
                .purchaseDate(LocalDate.of(2026, 1, 10))
                .type(InvestmentType.CRYPTO)
                .amount(new BigDecimal("500000.00"))
                .currency(SupportedCurrency.HUF)
                .note("Long-term hold");
    }

    public static InvestmentPatchBuilder investmentPatch() {
        return new InvestmentPatchBuilder().asset("Ethereum").note("Switched to Ethereum");
    }

    public static final class InvestmentBuilder {
        private String asset;
        private LocalDate purchaseDate;
        private InvestmentType type;
        private BigDecimal amount;
        private SupportedCurrency currency;
        private String note;

        public InvestmentBuilder asset(String v) {
            this.asset = v;
            return this;
        }

        public InvestmentBuilder purchaseDate(LocalDate v) {
            this.purchaseDate = v;
            return this;
        }

        public InvestmentBuilder type(InvestmentType v) {
            this.type = v;
            return this;
        }

        public InvestmentBuilder amount(BigDecimal v) {
            this.amount = v;
            return this;
        }

        public InvestmentBuilder currency(SupportedCurrency v) {
            this.currency = v;
            return this;
        }

        public InvestmentBuilder note(String v) {
            this.note = v;
            return this;
        }

        public InvestmentCreateDTO build() {
            return new InvestmentCreateDTO(asset, purchaseDate, type, amount, currency, note);
        }
    }

    public static final class InvestmentPatchBuilder {
        private String asset;
        private LocalDate purchaseDate;
        private InvestmentType type;
        private BigDecimal amount;
        private String note;

        public InvestmentPatchBuilder asset(String v) {
            this.asset = v;
            return this;
        }

        public InvestmentPatchBuilder purchaseDate(LocalDate v) {
            this.purchaseDate = v;
            return this;
        }

        public InvestmentPatchBuilder type(InvestmentType v) {
            this.type = v;
            return this;
        }

        public InvestmentPatchBuilder amount(BigDecimal v) {
            this.amount = v;
            return this;
        }

        public InvestmentPatchBuilder note(String v) {
            this.note = v;
            return this;
        }

        public InvestmentPatchDTO build() {
            return new InvestmentPatchDTO(asset, purchaseDate, type, amount, note);
        }
    }

    // -------------------------------------------------------------------------
    // Workspaces
    // -------------------------------------------------------------------------

    public static WorkspaceCreateBuilder workspace() {
        return new WorkspaceCreateBuilder().name("My Second Workspace").currency(SupportedCurrency.EUR);
    }

    public static WorkspaceRenameBuilder workspaceRename() {
        return new WorkspaceRenameBuilder().name("Renamed Workspace");
    }

    public static WorkspaceSettingsBuilder workspaceSettings() {
        return new WorkspaceSettingsBuilder().currency(SupportedCurrency.EUR).showBaseCurrency(true);
    }

    // -------------------------------------------------------------------------
    // User profile
    // -------------------------------------------------------------------------

    public static UserPatchBuilder userPatch() {
        return new UserPatchBuilder().username("UpdatedUsername");
    }

    public static final class UserPatchBuilder {
        private String username;

        public UserPatchBuilder username(String v) {
            this.username = v;
            return this;
        }

        public UserPatchDTO build() {
            return new UserPatchDTO(username);
        }
    }

    // -------------------------------------------------------------------------
    // Password management
    // -------------------------------------------------------------------------

    public static ChangePasswordBuilder changePassword() {
        return new ChangePasswordBuilder()
                .oldPassword("Password123!")
                .newPassword("NewPassword456!")
                .confirmNewPassword("NewPassword456!");
    }

    public static final class ChangePasswordBuilder {
        private String oldPassword;
        private String newPassword;
        private String confirmNewPassword;

        public ChangePasswordBuilder oldPassword(String v) {
            this.oldPassword = v;
            return this;
        }

        public ChangePasswordBuilder newPassword(String v) {
            this.newPassword = v;
            return this;
        }

        public ChangePasswordBuilder confirmNewPassword(String v) {
            this.confirmNewPassword = v;
            return this;
        }

        public ChangePasswordRequest build() {
            return new ChangePasswordRequest(oldPassword, newPassword, confirmNewPassword);
        }
    }

    // -------------------------------------------------------------------------
    // Registration (for admin user creation)
    // -------------------------------------------------------------------------

    public static RegisterBuilder registerRequest() {
        String uid = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        return new RegisterBuilder()
                .username("AdminUser" + uid)
                .email(uid + "@admin.test.com")
                .password("Password123!")
                .confirmPassword("Password123!")
                .currency(SupportedCurrency.HUF)
                .workspaceName("Admin Workspace " + uid);
    }

    public static final class RegisterBuilder {
        private String username;
        private String email;
        private String password;
        private String confirmPassword;
        private SupportedCurrency currency;
        private String workspaceName;

        public RegisterBuilder username(String v) {
            this.username = v;
            return this;
        }

        public RegisterBuilder email(String v) {
            this.email = v;
            return this;
        }

        public RegisterBuilder password(String v) {
            this.password = v;
            return this;
        }

        public RegisterBuilder confirmPassword(String v) {
            this.confirmPassword = v;
            return this;
        }

        public RegisterBuilder currency(SupportedCurrency v) {
            this.currency = v;
            return this;
        }

        public RegisterBuilder workspaceName(String v) {
            this.workspaceName = v;
            return this;
        }

        public RegisterRequest build() {
            return new RegisterRequest(username, email, password, confirmPassword, currency, workspaceName);
        }
    }

    public static final class WorkspaceCreateBuilder {
        private String name;
        private SupportedCurrency currency;

        public WorkspaceCreateBuilder name(String v) {
            this.name = v;
            return this;
        }

        public WorkspaceCreateBuilder currency(SupportedCurrency v) {
            this.currency = v;
            return this;
        }

        public WorkspaceCreateRequest build() {
            return new WorkspaceCreateRequest(name, currency);
        }
    }

    public static final class WorkspaceRenameBuilder {
        private String name;

        public WorkspaceRenameBuilder name(String v) {
            this.name = v;
            return this;
        }

        public WorkspaceRenameRequest build() {
            return new WorkspaceRenameRequest(name);
        }
    }

    public static final class WorkspaceSettingsBuilder {
        private SupportedCurrency currency;
        private Boolean showBaseCurrency;

        public WorkspaceSettingsBuilder currency(SupportedCurrency v) {
            this.currency = v;
            return this;
        }

        public WorkspaceSettingsBuilder showBaseCurrency(Boolean v) {
            this.showBaseCurrency = v;
            return this;
        }

        public WorkspaceSettingsPatchRequest build() {
            return new WorkspaceSettingsPatchRequest(currency, showBaseCurrency);
        }
    }
}
