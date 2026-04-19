import { Locator, Page } from '@playwright/test';

// Page-level
export const getPageTitle = (page: Page): Locator => page.getByTestId('page-title');
export const getTabGroup = (page: Page): Locator => page.getByTestId('tab-group');
export const getActiveTab = (page: Page): Locator => getTabGroup(page).locator('[role="tab"][aria-selected="true"]');
export const getTabs = (page: Page): Locator => getTabGroup(page).locator('[role="tab"]');

export const getTransactionsTabLabel = (page: Page): Locator => page.getByTestId('transactions-tab-label');
export const getTransactionsTabIcon = (page: Page): Locator => getTransactionsTabLabel(page).locator('mat-icon');
export const getTransactionsTabText = (page: Page): Locator => getTransactionsTabLabel(page).getByText('Transactions');

export const getCategoriesTabLabel = (page: Page): Locator => page.getByTestId('categories-tab-label');
export const getCategoriesTabIcon = (page: Page): Locator => getCategoriesTabLabel(page).locator('mat-icon');
export const getCategoriesTabText = (page: Page): Locator => getCategoriesTabLabel(page).getByText('Categories');

// Recurring lists (large screen — two separate)
export const getRecurringExpensesList = (page: Page): Locator => page.getByTestId('recurring-expenses-list');
export const getRecurringIncomesList = (page: Page): Locator => page.getByTestId('recurring-incomes-list');
// Recurring list (mobile — combined)
export const getRecurringTransactionsList = (page: Page): Locator => page.getByTestId('recurring-transactions-list');

// Transaction list
export const getTransactionList = (page: Page): Locator => page.getByTestId('transaction-list');
export const getTransactionRows = (page: Page): Locator => page.getByTestId('data-row');
export const getTransactionRow = (page: Page, title: string): Locator =>
	page.getByTestId('data-row').filter({ hasText: title });
export const getTransactionMenuTrigger = (page: Page): Locator => page.getByTestId('menu-trigger-btn');

// Category list (categories tab)
export const getCategoryList = (page: Page): Locator => page.getByTestId('category-list');
export const getCategoryListRows = (page: Page): Locator => page.getByTestId('category-list').getByTestId('data-row');
export const getCategoryListRow = (page: Page, name: string): Locator =>
	page.getByTestId('category-list').getByTestId('data-row').filter({ hasText: name });
export const getCategoryListAddBtn = (page: Page): Locator => page.getByTestId('category-list').getByTestId('add-btn');
export const getCategoryListAmountSpan = (categoryRow: Locator): Locator => categoryRow.locator('span.fw-semibold');
export const getCategoryListEmptyState = (page: Page): Locator => getCategoryList(page).getByTestId('empty-state');
export const getCategoryRowIconContainer = (categoryRow: Locator): Locator => categoryRow.locator('.icon-container');
export const getCategoryRowIcon = (categoryRow: Locator): Locator => categoryRow.locator('.icon-container mat-icon');
export const getCategoryRowInlineActionBtn = (categoryRow: Locator): Locator =>
	categoryRow.getByTestId('inline-action-btn');

// Filter
export const getFilterMenuBtn = (page: Page): Locator => page.getByTestId('filter-menu-btn');
export const getFilterMenuBtnBtn = (page: Page): Locator => getFilterMenuBtn(page).getByTestId('btn');
export const getFilterMenuBtnCollapsed = (page: Page): Locator => getFilterMenuBtn(page).locator('button.collapsed');
export const getFilterTypeSelect = (page: Page): Locator => page.getByTestId('filter-type-select');
export const getFilterBadge = (page: Page): Locator =>
	page.getByTestId('filter-menu-btn').locator('.mat-badge-content');
export const getSearchTextInput = (page: Page): Locator => page.getByTestId('search-text-input');
export const getRecurringFilterCheckbox = (page: Page): Locator =>
	page.locator('mat-checkbox').filter({ hasText: 'Recurring' }).locator('input');

// Confirm dialog (duplicate / delete confirmation)
export const getConfirmDialog = (page: Page): Locator => page.locator('mat-dialog-container');
export const getConfirmDialogActionBtn = (page: Page, text: string): Locator =>
	page.locator('mat-dialog-container').getByTestId('action-btn').filter({ hasText: text });
