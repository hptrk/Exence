# Integration Test - End-to-End User Stories

Each flow describes a multi-step, real-world user scenario.
Steps run in order, and each step includes the HTTP method + endpoint and expected result.

---

## Group 1 - Auth & Account Management

### FLOW-AUTH-01 - Full registration and verification onboarding

**Description:** A new user registers, verifies their email, then checks their status.

1. `POST /auth/register` with valid data -> HTTP 200, `access_token` + `refresh_token` appear in cookies
2. `GET /user` -> `isVerified = false`
3. `POST /user/request-verify-email` -> HTTP 204 (token sent)
4. `POST /user/request-verify-email` again (rate-limit test) -> HTTP 409 `EMAIL_ALREADY_VERIFIED` **or** the second attempt succeeds if the previous token was not used yet
5. Extract the verification token (for example from DB or a test-email hook)
6. `POST /auth/verify-email` with the token -> HTTP 204
7. `GET /user` -> `isVerified = true`
8. `POST /auth/verify-email` again with the same token -> HTTP 401 `INVALID_TOKEN` (token revoked)

---

### FLOW-AUTH-02 - Full password reset cycle

**Description:** The user forgot their password, resets it, and all old sessions become invalid.

1. `POST /auth/register` + `POST /auth/verify-email` -> verified user, active session
2. `POST /auth/login` from a second "device" (different User-Agent) -> second active session
3. `POST /auth/forgot-password` with the registered email -> HTTP 204
4. `POST /auth/forgot-password` with the same email shortly after -> HTTP 429 `TOO_MANY_EMAILS`
5. Extract the reset token
6. `POST /auth/reset-password` with the new password -> HTTP 204
7. `GET /user` with the **original** access token -> HTTP 401 (token revoked)
8. `GET /user` with the **second session** access token -> HTTP 401 (all sessions revoked)
9. `POST /auth/login` with the **old** password -> HTTP 401 `AUTHENTICATION_FAILED`
10. `POST /auth/login` with the **new** password -> HTTP 200, new tokens

---

### FLOW-AUTH-03 - Forced re-login on all devices after password change

**Description:** User changes password; all active sessions become invalid.

1. `POST /auth/register` + `POST /auth/verify-email`
2. `POST /auth/login` as Device-A -> session A
3. `POST /auth/login` as Device-B (different User-Agent) -> session B
4. `GET /sessions` from Device-A -> 2 sessions visible, current one `isCurrent = true`
5. From Device-A: `POST /user/change-password` with valid old + new password -> HTTP 204
6. From Device-A: `GET /user` -> HTTP 401 (token revoked)
7. From Device-B: `GET /user` -> HTTP 401 (token revoked)
8. `POST /auth/login` with the **new** password -> HTTP 200
9. `POST /user/change-password` with a password matching password history -> HTTP 400 `INVALID_PASSWORD`

---

### FLOW-AUTH-04 - Account deletion and cascade effect

**Description:** User deletes their account; after that no authenticated request works.

1. `POST /auth/register` + `POST /auth/verify-email`
2. `POST /workspaces` -> creates an extra workspace
3. `GET /workspaces` -> 2 workspaces visible
4. `DELETE /user` -> HTTP 204
5. `POST /auth/login` with the same email -> HTTP 401 `AUTHENTICATION_FAILED`
6. `GET /user` with previous access token -> HTTP 401

---

### FLOW-AUTH-05 - Token refresh and expiration handling

**Description:** Obtain a new access token via refresh token and invalidate the old refresh token.

1. `POST /auth/register` + `POST /auth/verify-email`
2. `POST /auth/login` -> access token + refresh token
3. `POST /auth/refresh-token` with refresh token -> HTTP 204, **new** access token and refresh token in cookies
4. `POST /auth/refresh-token` again with the **old** refresh token -> HTTP 401 `INVALID_TOKEN` (one-time use)
5. `GET /user` with the **new** access token -> HTTP 200

---

## Group 2 - Session & Device Management

### FLOW-SESSION-01 - Multi-device session handling and targeted revoke

**Description:** Log in from multiple devices and revoke a specific session.

1. `POST /auth/register` + `POST /auth/verify-email`
2. `POST /auth/login` Device-A (User-Agent: `TestDeviceA`) -> session A
3. `POST /auth/login` Device-B (User-Agent: `TestDeviceB`) -> session B
4. `POST /auth/login` Device-C (User-Agent: `TestDeviceC`) -> session C
5. From Device-A: `GET /sessions` -> 3 sessions, A has `isCurrent = true`
6. From Device-A: `DELETE /sessions/{sessionB_id}` -> HTTP 204
7. From Device-B: `GET /user` -> HTTP 401 (session B revoked)
8. From Device-A: `GET /sessions` -> 2 sessions visible (A and C)
9. From Device-C: `GET /user` -> HTTP 200 (session C still active)

---

### FLOW-SESSION-02 - "Log out everywhere" feature

**Description:** User revokes all other sessions; only current session remains active.

1. `POST /auth/register` + `POST /auth/verify-email`
2. `POST /auth/login` Device-A -> session A
3. `POST /auth/login` Device-B -> session B
4. `POST /auth/login` Device-C -> session C
5. From Device-A: `DELETE /sessions/others` -> HTTP 204
6. From Device-B: `GET /user` -> HTTP 401
7. From Device-C: `GET /user` -> HTTP 401
8. From Device-A: `GET /user` -> HTTP 200 (own session alive)
9. From Device-A: `GET /sessions` -> 1 session, `isCurrent = true`

---

## Group 3 - User Profile & Settings

### FLOW-PROFILE-01 - Managing profile and user settings

**Description:** User updates profile and settings, then verifies changes.

1. `POST /auth/register` + `POST /auth/verify-email`
2. `GET /user` -> verify username, email, role
3. `PATCH /user` with new username -> HTTP 200, response has new username
4. `GET /user` -> new username is shown
5. `GET /user/settings` -> language, primaryTheme, secondaryTheme, baseCurrency, showBaseCurrency
6. `PATCH /user/settings` updating language + primaryTheme -> HTTP 200, new values
7. `GET /user/settings` -> updated values are visible, non-updated fields unchanged
8. `PATCH /user/settings` with invalid language code -> HTTP 400 `VALIDATION_ERROR`

---

## Group 4 - Workspace Lifecycle

### FLOW-WS-01 - Workspace CRUD and last-workspace protection

**Description:** Create, rename, and delete workspaces, including blocking deletion of the last workspace.

1. `POST /auth/register` + `POST /auth/verify-email` (first workspace is created automatically)
2. `GET /workspaces` -> 1 workspace, OWNER role
3. `DELETE /workspaces/{ws1_id}` -> HTTP 409 `WORKSPACE_CANNOT_DELETE_LAST`
4. `POST /workspaces` with new name -> HTTP 201, second workspace
5. `GET /workspaces` -> 2 workspaces
6. `PATCH /workspaces/{ws2_id}` with new name -> HTTP 200, new name in response
7. `DELETE /workspaces/{ws1_id}` -> HTTP 204
8. `GET /workspaces` -> 1 workspace remains
9. `PATCH /workspaces/{ws1_id}` (non-existent) -> HTTP 404 `WORKSPACE_NOT_FOUND`

---

### FLOW-WS-02 - Workspace settings management (owner permissions)

**Description:** Update workspace currency and display settings with permission checks.

1. `POST /auth/register` + `POST /auth/verify-email`
2. `POST /auth/register` second user (userB) + `POST /auth/verify-email`
3. UserA: `POST /workspaces/{id}/members` with userB email -> HTTP 200, userB becomes MEMBER
4. UserA: `GET /workspaces/settings` (X-Workspace-ID) -> baseCurrency, showBaseCurrency
5. UserA: `PATCH /workspaces/settings` `showBaseCurrency=false` -> HTTP 200, new value visible
6. UserB: `PATCH /workspaces/settings` `showBaseCurrency=true` -> HTTP 403 `WORKSPACE_OWNER_REQUIRED`
7. UserB: `GET /workspaces/settings` -> HTTP 200 (read allowed)

---

### FLOW-WS-03 - Member invite, leave, and remove lifecycle

**Description:** Full workspace member-management lifecycle with two users.

1. UserA: `POST /auth/register` + verify -> workspace created
2. UserB: `POST /auth/register` + verify
3. UserA: `POST /workspaces/{id}/members` with userB email -> HTTP 200
4. UserA: `POST /workspaces/{id}/members` with userB email again -> HTTP 409 `WORKSPACE_MEMBER_ALREADY_EXISTS`
5. UserA: `GET /workspaces/{id}/members` -> 2 members (A: OWNER, B: MEMBER)
6. UserB: `GET /workspaces` -> workspace appears in userB list
7. UserB: `DELETE /workspaces/{id}/members/me` -> HTTP 204 (leave)
8. UserB: `GET /workspaces` -> workspace disappeared from userB list
9. UserA: `POST /workspaces/{id}/members` with userB email -> can be added again
10. UserA: `DELETE /workspaces/{id}/members` with userB email -> HTTP 204
11. UserA: `DELETE /workspaces/{id}/members/me` (owner tries to leave) -> HTTP 409 `WORKSPACE_OWNER_CANNOT_LEAVE`
12. UserA: `DELETE /workspaces/{id}/members` with userA email (remove owner) -> HTTP 409 `WORKSPACE_OWNER_CANNOT_BE_REMOVED`

---

## Group 5 - Category & Transaction

### FLOW-TXN-01 - Category lifecycle and transaction binding

**Description:** Create category, bind it to transactions, verify deletion block, then unblock.

1. `POST /auth/register` + verify, workspace ready
2. `POST /categories` with EXPENSE type, valid name + icon + color -> HTTP 201
3. `POST /categories` with same name -> HTTP 409 `CATEGORY_ALREADY_EXISTS`
4. `GET /categories` -> new category is present
5. `PATCH /categories/{id}` with new name -> HTTP 200, GET shows new name
6. `POST /transactions` with new category, valid data -> HTTP 201
7. `DELETE /categories/{id}` -> HTTP 409 `CATEGORY_IN_USE`
8. `DELETE /transactions/{id}` -> HTTP 204
9. `DELETE /categories/{id}` -> HTTP 204 (now deletable)
10. `GET /categories/{id}` -> HTTP 404

---

### FLOW-TXN-02 - Transaction CRUD and filtering coverage

**Description:** Create multiple transactions, filter by parameters, verify totals.

1. `POST /auth/register` + verify
2. `POST /categories` EXPENSE type -> catExpense_id
3. `POST /categories` INCOME type -> catIncome_id
4. `POST /transactions` EXPENSE, catExpense_id, amount=100, date=2024-01-10 -> t1
5. `POST /transactions` EXPENSE, catExpense_id, amount=200, date=2024-02-15 -> t2
6. `POST /transactions` INCOME, catIncome_id, amount=500, date=2024-03-01 -> t3
7. `GET /transactions` -> 3 transactions, date desc order
8. `GET /transactions?type=EXPENSE` -> 2 transactions (t1, t2)
9. `GET /transactions?categoryId={catExpense_id}` -> 2 transactions
10. `GET /transactions?dateFrom=2024-02-01&dateTo=2024-02-28` -> 1 transaction (t2)
11. `GET /transactions?amountFrom=150&amountTo=300` -> 1 transaction (t2)
12. `GET /transactions?page=0&size=2` -> 2 items, totalElements=3
13. `GET /transactions/totals` -> totalExpense=300, totalIncome=500
14. `GET /categories/top-by-amount?type=EXPENSE` -> catExpense aggregated as highest spent
15. `PATCH /transactions/{t1_id}` amount=150 -> HTTP 200
16. `GET /transactions/totals` -> totalExpense=350 (updated)

---

### FLOW-TXN-03 - Multi-currency transactions and exchange-rate integration

**Description:** Create transactions in different currencies and verify automatic exchange-rate application.

1. `POST /auth/register` (baseCurrency=HUF) + verify
2. `POST /categories` EXPENSE type
3. `GET /exchange-rates?from=USD&to=HUF&date=2024-01-15` -> verify rate
4. `POST /transactions` currency=USD, amount=100 -> HTTP 201, `baseCurrencyAmount` = 100 * rate
5. `GET /transactions/{id}` -> currency=USD, exchangeRate populated, baseCurrencyAmount calculated
6. `POST /transactions` currency=EUR, amount=50, with custom exchangeRate -> HTTP 201
7. `GET /transactions/{id}` -> manually provided exchangeRate is shown
8. `GET /transactions/totals` -> totalExpense includes baseCurrencyAmount of both transactions
9. `GET /exchange-rates?from=HUF&to=HUF&date=2024-01-15` -> 1.0 (same currency)

---

### FLOW-TXN-04 - Workspace isolation for transactions

**Description:** No data leak between two workspaces.

1. UserA: `POST /auth/register` + verify -> Workspace-A
2. UserB: `POST /auth/register` + verify -> Workspace-B
3. UserA: `POST /categories` + `POST /transactions` -> in Workspace-A
4. UserB: `POST /categories` + `POST /transactions` -> in Workspace-B
5. UserA: `GET /transactions` (X-Workspace-ID=Workspace-A) -> only Workspace-A transactions
6. UserA: `GET /transactions/{userB_transaction_id}` (X-Workspace-ID=Workspace-A) -> HTTP 404
7. UserB: `GET /transactions` (X-Workspace-ID=Workspace-B) -> only Workspace-B transactions

---

## Group 6 - Recurring Transactions

### FLOW-REC-01 - Full recurring transaction lifecycle

**Description:** Create, update, and delete recurring transactions of different types.

1. `POST /auth/register` + verify
2. `POST /categories` EXPENSE -> cat_id
3. `POST /transactions/recurring` DAILY, UNTIL_DATE endCondition, future endDate -> HTTP 201, nextExecutionDate = startDate
4. `POST /transactions/recurring` WEEKLY, AFTER_OCCURRENCES, maxOccurrences=12 -> HTTP 201
5. `POST /transactions/recurring` MONTHLY, dayOfMonth=1, UNTIL_DATE, but without endDate -> HTTP 400 `VALIDATION_ERROR`
6. `GET /transactions/recurring` -> 2 active recurring items, nextExecutionDate asc order
7. `GET /transactions/recurring?type=EXPENSE` -> both are EXPENSE type
8. `GET /transactions/recurring/{id}` -> verify all fields
9. `PATCH /transactions/recurring/{id}` updating title + interval -> HTTP 200, new values
10. `DELETE /transactions/recurring/{rec1_id}` -> HTTP 204
11. `GET /transactions/recurring` -> 1 recurring item remains
12. `GET /transactions/recurring/{rec1_id}` -> HTTP 404

---

## Group 7 - Goals

### FLOW-GOAL-01 - Goal lifecycle and automatic status transition

**Description:** From goal creation to completion, with automatic COMPLETED transition.

1. `POST /auth/register` + verify (email verification required for goals module)
2. `POST /categories` -> cat_id
3. `POST /goals` targetAmount=1000, initialAmount=0, default status ACTIVE -> HTTP 201
4. `GET /goals` -> 1 goal, status=ACTIVE
5. `GET /goals?statuses=COMPLETED` -> empty list
6. `PATCH /goals/{id}` currentAmount=400 -> HTTP 200, status=ACTIVE (target not reached)
7. `PATCH /goals/{id}` currentAmount=1000 -> HTTP 200, status=COMPLETED (target reached)
8. `GET /goals?statuses=ACTIVE` -> empty list
9. `GET /goals?statuses=COMPLETED` -> 1 goal
10. `PATCH /goals/{id}` status=ACTIVE (revert) -> HTTP 200
11. `DELETE /goals/{id}` -> HTTP 204
12. `GET /goals/{id}` -> HTTP 404

---

### FLOW-GOAL-02 - Instant completion and widget data

**Description:** Goal becomes COMPLETED immediately if initialAmount >= targetAmount; fetch widget data.

1. `POST /auth/register` + verify
2. `POST /categories` -> cat_id
3. `POST /goals` targetAmount=500, initialAmount=500 -> HTTP 201, status=COMPLETED (instant)
4. `POST /goals` targetAmount=500, initialAmount=600 -> HTTP 201, status=COMPLETED (also on overshoot)
5. `POST /goals` targetAmount=1000, initialAmount=200, deadline=future date -> HTTP 201, status=ACTIVE
6. `GET /goals` -> 3 goals
7. `GET /goals/widget-data?type=GOAL_SUMMARY` -> response contains aggregated data
8. `GET /goals/widget-data?type=GOAL_PROGRESS&goalId={activeGoal_id}` -> progress data
9. `PATCH /goals/{activeGoal_id}` status=PAUSED -> HTTP 200
10. `GET /goals?statuses=PAUSED` -> 1 goal

---

### FLOW-GOAL-03 - Email verification barrier in Goals module

**Description:** Unverified user cannot access goals endpoints.

1. `POST /auth/register` (DOES NOT verify email)
2. `POST /goals` -> HTTP 403 `EMAIL_VERIFICATION_REQUIRED`
3. `GET /goals` -> HTTP 403 `EMAIL_VERIFICATION_REQUIRED`
4. `POST /auth/verify-email` (with token) -> HTTP 204
5. `POST /categories` -> cat_id
6. `POST /goals` with valid data -> HTTP 201 (now works)

---

## Group 8 - Debts

### FLOW-DEBT-01 - Full debt payment lifecycle (partial + full)

**Description:** Create debt, make partial payments, then settle fully.

1. `POST /auth/register` + verify
2. `POST /categories` -> cat_id
3. `POST /debts` LENT type, originalAmount=300, counterpartyName="Test Friend" -> HTTP 201, status=ACTIVE, remainingAmount=300
4. `GET /debts` -> 1 debt
5. `GET /debts?type=LENT` -> 1 debt
6. `GET /debts?statuses=SETTLED` -> empty list
7. `PATCH /debts/{id}/payment` amount=100 -> HTTP 200, remainingAmount=200, status=ACTIVE
8. `PATCH /debts/{id}/payment` amount=250 -> HTTP 400 `DEBT_PAYMENT_EXCEEDS_REMAINING` (100+250 > 300, but remaining=200)
9. `PATCH /debts/{id}/payment` amount=200 -> HTTP 200, remainingAmount=0, status=SETTLED
10. `GET /debts?statuses=SETTLED` -> 1 debt
11. `GET /debts?statuses=ACTIVE` -> empty list

---

### FLOW-DEBT-02 - Mixed debt portfolio and widget data

**Description:** Manage LENT and BORROWED debts, and fetch list/widget data.

1. `POST /auth/register` + verify
2. `POST /categories` -> cat_id
3. `POST /debts` LENT, originalAmount=500 -> debt_lent_id
4. `POST /debts` BORROWED, originalAmount=200 -> debt_borrowed_id
5. `GET /debts` -> 2 debts
6. `GET /debts?type=BORROWED` -> 1 debt
7. `PATCH /debts/{debt_lent_id}` updating title + deadline -> HTTP 200
8. `GET /debts/{debt_lent_id}` -> updated data
9. `GET /debts/widget-data?type=DEBT_SUMMARY` -> aggregated data (total lent, total borrowed)
10. `DELETE /debts/{debt_borrowed_id}` -> HTTP 204
11. `GET /debts` -> 1 debt remains
12. As unverified user: `GET /debts` -> HTTP 403 `EMAIL_VERIFICATION_REQUIRED`

---

## Group 9 - Investments

### FLOW-INV-01 - Building investment portfolio and grouped view

**Description:** Create multiple investments for same and different assets, then verify grouped view.

1. `POST /auth/register` + verify
2. `POST /investments` asset="Bitcoin", type=CRYPTO, amount=0.5, currency=USD -> HTTP 201
3. `POST /investments` asset="Bitcoin", type=CRYPTO, amount=0.3, currency=USD -> HTTP 201 (same asset)
4. `POST /investments` asset="Apple Inc.", type=STOCK, amount=10, currency=USD -> HTTP 201
5. `POST /investments` asset="Gold", type=COMMODITY, amount=50, currency=EUR -> HTTP 201
6. `GET /investments` -> 4 investments
7. `GET /investments/grouped` -> 3 groups (Bitcoin, Apple Inc., Gold), Bitcoin amount aggregated
8. `PATCH /investments/{bitcoin1_id}` updating note -> HTTP 200
9. `DELETE /investments/{apple_id}` -> HTTP 204
10. `GET /investments/grouped` -> 2 groups (Bitcoin, Gold)
11. `GET /investments/widget-data?type=INVESTMENT_SUMMARY` -> aggregated data
12. `GET /investments/widget-data?type=INVALID_TYPE` -> HTTP 400 `INVESTMENT_WIDGET_TYPE_NOT_SUPPORTED`

---

## Group 10 - Statistics & Widgets

### FLOW-WIDGET-01 - Dashboard widget layout and data handling

**Description:** Fetch layout, add widget, update layout, fetch widget data.

1. `POST /auth/register` + verify (default widgets are created during registration)
2. `GET /statistics/widgets/layout` -> statCardWidgets and chartWidgets lists, not empty
3. `GET /statistics/widgets/dashboard?timeframe=MONTH` -> balance trend data
4. `GET /statistics/widgets/{existingWidget_id}/data?timeframe=MONTH` -> widget-specific data
5. `GET /statistics/widgets/{existingWidget_id}/data?timeframe=YEAR` -> same widget, different timeframe
6. `GET /statistics/widgets/9999/data` -> HTTP 404 `WIDGET_NOT_FOUND`
7. `POST /statistics/widgets` with valid CreateDTO -> HTTP 201
8. `GET /statistics/widgets/layout` -> new widget appears
9. `PUT /statistics/widgets/layout` excluding newly added widget -> HTTP 200
10. `GET /statistics/widgets/layout` -> excluded widget disappeared

---

### FLOW-WIDGET-02 - Email verification barrier in Statistics module

**Description:** Unverified user cannot view statistics.

1. `POST /auth/register` (DOES NOT verify)
2. `GET /statistics/widgets/layout` -> HTTP 403 `EMAIL_VERIFICATION_REQUIRED`
3. `GET /statistics/widgets/dashboard` -> HTTP 403 `EMAIL_VERIFICATION_REQUIRED`
4. `POST /auth/verify-email` (with token)
5. `GET /statistics/widgets/layout` -> HTTP 200

---

## Group 11 - Audit Log

### FLOW-AUDIT-01 - Workspace audit log filtering and permissions

**Description:** Owner can see workspace audit logs; MEMBER cannot.

1. UserA: `POST /auth/register` + verify -> Workspace-A owner
2. UserB: `POST /auth/register` + verify
3. UserA: `POST /workspaces/{id}/members` with userB -> MEMBER
4. UserA: `POST /categories` -> audit entry is created
5. UserA: `POST /transactions` -> audit entry is created
6. UserA: `GET /audit-logs` (X-Workspace-ID=Workspace-A) -> paginated list, at least 2 entries
7. UserA: `GET /audit-logs?entityType=TRANSACTION` -> only transaction changes
8. UserA: `GET /audit-logs?changeType=CREATE` -> only creation events
9. UserB: `GET /audit-logs` (X-Workspace-ID=Workspace-A) -> HTTP 403 (owner-only)
10. Unauthenticated: `GET /audit-logs` -> HTTP 401

---

## Group 12 - Admin

### FLOW-ADMIN-01 - Admin permissions and platform-level operations

**Description:** Create admin user, access admin-only endpoints, ensure normal user is blocked.

1. Using existing ADMIN user: `POST /admin/auth/register` -> create new ADMIN user -> HTTP 200
2. `POST /auth/login` with new ADMIN user -> HTTP 200
3. `GET /admin/statistics/widgets/data?type=TOTAL_USERS` -> platform-level aggregated data
4. `GET /admin/system-settings` -> read system settings
5. `PATCH /admin/system-settings` updating one setting -> HTTP 200, new value in response
6. `GET /admin/audit-logs` -> platform-level audit logs
7. `POST /admin/email/broadcast` with subject + body -> HTTP 200 (asynchronous send starts)
8. As normal USER: `GET /admin/statistics/widgets/data` -> HTTP 403
9. As normal USER: `GET /admin/system-settings` -> HTTP 403
10. As normal USER: `GET /admin/audit-logs` -> HTTP 403

---

## Group 13 - Complex Cross-Module Flows

### FLOW-CROSS-01 - Full financial onboarding with one user

**Description:** Full user onboarding from registration to first use of all major features.

1. `POST /auth/register` (baseCurrency=HUF) -> HTTP 200
2. `POST /auth/verify-email` -> verify
3. `GET /user` + `GET /user/settings` -> verify data
4. `GET /workspaces` -> 1 default workspace
5. `POST /categories` EXPENSE "Restaurant" -> cat_expense
6. `POST /categories` INCOME "Salary" -> cat_income
7. `POST /transactions` EXPENSE, amount=5000, cat_expense -> txn1
8. `POST /transactions` INCOME, amount=500000, cat_income -> txn2
9. `GET /transactions/totals` -> totalExpense=5000, totalIncome=500000
10. `POST /goals` targetAmount=100000, cat_expense -> goal1
11. `PATCH /goals/{goal1_id}` currentAmount=50000 -> ACTIVE
12. `POST /debts` LENT, amount=20000, cat_expense -> debt1
13. `PATCH /debts/{debt1_id}/payment` amount=10000 -> remainingAmount=10000
14. `POST /investments` asset="MSFT", STOCK, amount=100, USD -> inv1
15. `GET /investments/grouped` -> 1 group
16. `GET /statistics/widgets/layout` -> default widgets
17. `GET /statistics/widgets/dashboard?timeframe=MONTH` -> balance trend
18. `GET /achievements` -> achievement list (existing achievements listed)
19. `GET /achievements/unlocked` -> list (there may already be unlocked items)

---

### FLOW-CROSS-02 - Workspace collaboration and visibility

**Description:** Two users work in a shared workspace and validate what each user can see.

1. UserA: `POST /auth/register` + verify -> Workspace-A
2. UserB: `POST /auth/register` + verify -> Workspace-B (own)
3. UserA: `POST /workspaces/{wsA_id}/members` with userB -> MEMBER
4. UserB: `GET /workspaces` -> 2 workspaces (own B + A)
5. UserA: `POST /categories` "Shared category" -> cat_A_id (in Workspace-A)
6. UserB: `GET /categories` (X-Workspace-ID=Workspace-A) -> sees userA category
7. UserB: `POST /transactions` in Workspace-A with cat_A_id -> HTTP 201
8. UserA: `GET /transactions` in Workspace-A -> sees userB transaction too
9. UserB: `GET /transactions` (X-Workspace-ID=Workspace-B) -> only own Workspace-B transactions (none)
10. UserA: `GET /audit-logs` in Workspace-A -> userB transaction creation is visible
11. UserB: `DELETE /workspaces/{wsA_id}/members/me` -> HTTP 204 (leave)
12. UserB: `GET /categories` (X-Workspace-ID=Workspace-A) -> HTTP 403/404 (no access)

---

### FLOW-CROSS-03 - Impact of workspace currency change on transactions

**Description:** After changing workspace baseCurrency, existing transaction baseCurrencyAmount values are recalculated.

1. `POST /auth/register` (baseCurrency=HUF) + verify
2. `POST /categories` -> cat_id
3. `POST /transactions` currency=HUF, amount=100000 -> baseCurrencyAmount=100000
4. `POST /transactions` currency=USD, amount=100 -> baseCurrencyAmount ~ 100 * HUF/USD rate
5. `GET /transactions/totals` -> record totalExpense
6. `PATCH /workspaces/settings` baseCurrency=EUR -> HTTP 200 (exchange-rate recalculation starts)
7. `GET /transactions/{huf_txn_id}` -> baseCurrencyAmount recalculated to EUR
8. `GET /transactions/{usd_txn_id}` -> baseCurrencyAmount recalculated to EUR
9. `GET /workspaces/settings` -> baseCurrency=EUR

---

### FLOW-CROSS-04 - Complete recurring transaction -> goal tracking flow

**Description:** Combine recurring transactions and goals for regular savings tracking.

1. `POST /auth/register` + verify
2. `POST /categories` INCOME "Savings" -> cat_savings
3. `POST /goals` targetAmount=120000, initialAmount=0, cat_savings -> savings_goal
4. `POST /transactions/recurring` MONTHLY, amount=10000, cat_savings, startDate=today -> rec_id
5. `GET /transactions/recurring/{rec_id}` -> verify nextExecutionDate
6. `GET /goals/{savings_goal_id}` -> currentAmount=0 (no completion yet)
7. `PATCH /goals/{savings_goal_id}` currentAmount=10000 (simulate first monthly contribution)
8. `GET /goals/{savings_goal_id}` -> currentAmount=10000, status=ACTIVE
9. `PATCH /goals/{savings_goal_id}` currentAmount=120000 -> status=COMPLETED
10. `PATCH /transactions/recurring/{rec_id}` active/pause (if supported) or DELETE
11. `DELETE /transactions/recurring/{rec_id}` -> HTTP 204
12. `GET /goals?statuses=COMPLETED` -> 1 completed goal

---

### FLOW-CROSS-05 - Achievement triggering across goals/debts

**Description:** Check achievements after goal and debt activities.

1. `POST /auth/register` + verify
2. `GET /achievements` -> all achievement names + descriptions (not necessarily unlocked)
3. `GET /achievements/unlocked` -> empty list (fresh workspace)
4. `POST /categories` -> cat_id
5. `POST /goals` x 3 (three different goals) -> completion threshold setup
6. `PATCH /goals/{g1}/currentAmount=targetAmount` -> COMPLETED
7. `PATCH /goals/{g2}/currentAmount=targetAmount` -> COMPLETED
8. `PATCH /goals/{g3}/currentAmount=targetAmount` -> COMPLETED
9. `GET /achievements/unlocked` -> new achievement(s) appear (if goal-completion threshold is reached)
10. `POST /debts` LENT x 2 -> debt_1, debt_2
11. `PATCH /debts/{debt_1_id}/payment` full amount -> SETTLED
12. `GET /achievements/unlocked` -> possibly new debt-related achievement

---

### FLOW-CROSS-06 - Pre-deletion data export-like check

**Description:** Before deleting account, user verifies all data, then deletes account.

1. `POST /auth/register` + verify
2. Seed data: `POST /categories`, `POST /transactions` x3, `POST /goals`, `POST /debts`, `POST /investments`
3. `GET /transactions/totals` -> final totals
4. `GET /goals` -> goal states
5. `GET /debts` -> debt states
6. `GET /investments/grouped` -> portfolio summary
7. `GET /audit-logs` -> latest audit entries (if owner)
8. `DELETE /user` -> HTTP 204
9. `POST /auth/login` with same email -> HTTP 401 `AUTHENTICATION_FAILED`
10. With previous access token: `GET /user` -> HTTP 401

---

### FLOW-CROSS-07 - X-Workspace-ID header validations

**Description:** Incorrect header handling for workspace-scoped endpoints.

1. `POST /auth/register` + verify
2. `POST /categories` **without** X-Workspace-ID header -> HTTP 400
3. `POST /categories` X-Workspace-ID=99999 (non-existent workspace) -> HTTP 404 `WORKSPACE_NOT_FOUND`
4. UserB: `POST /auth/register` + verify -> own Workspace-B
5. UserA: `GET /categories` (X-Workspace-ID=Workspace-B) -> HTTP 403/404 (not a member)
6. UserA: `POST /workspaces/{wsB_id}/members` with UserA email (UserA is not a member, UserB would need to invite) -> this must be done by UserB: UserB invites UserA
7. UserA: `GET /categories` (X-Workspace-ID=Workspace-B) -> HTTP 200 (now member)
