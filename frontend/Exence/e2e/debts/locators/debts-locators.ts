import { Locator, Page } from '@playwright/test';

// Empty state
export const getDebtsEmptyState = (page: Page): Locator => page.getByTestId('debts-empty-state');
export const getDebtsEmptyCreateBtn = (page: Page): Locator => page.getByTestId('debts-empty-create-btn');

// Statistics section
export const getDebtStatCards = (page: Page): Locator => page.getByTestId('debt-stat-cards');

// Debt lists
export const getDebtBorrowedList = (page: Page): Locator => page.getByTestId('debt-list-borrowed');
export const getDebtLentList = (page: Page): Locator => page.getByTestId('debt-list-lent');
export const getDebtListsContainer = (page: Page): Locator => page.getByTestId('debt-lists-container');

// Add buttons (scoped per list)
export const getDebtBorrowedListAddBtn = (page: Page): Locator => getDebtBorrowedList(page).getByTestId('add-btn');
export const getDebtLentListAddBtn = (page: Page): Locator => getDebtLentList(page).getByTestId('add-btn');

// List rows (scoped per list and combined)
export const getDebtBorrowedListRows = (page: Page): Locator => getDebtBorrowedList(page).getByTestId('data-row');
export const getDebtLentListRows = (page: Page): Locator => getDebtLentList(page).getByTestId('data-row');
export const getDebtListRows = (page: Page): Locator => page.getByTestId('data-row');

// Row interactions
export const getDebtMenuTrigger = (row: Locator): Locator => row.getByTestId('menu-trigger-btn');
export const getDebtEditAction = (page: Page): Locator => page.getByTestId('row-action-edit');
export const getDebtDeleteAction = (page: Page): Locator => page.getByTestId('row-action-delete');

// Status indicator (left of title column)
export const getDebtStatusIndicator = (row: Locator): Locator => row.getByTestId('debt-status-indicator');

// Expanded row detail sections
export const getDebtExpandedDetails = (page: Page): Locator => page.getByTestId('debt-expanded-details');
export const getDebtProgressBar = (page: Page): Locator => page.getByTestId('debt-progress-bar-label').first();
export const getDebtCounterparty = (page: Page): Locator => page.getByTestId('debt-counterparty-label').first();
export const getDebtOriginalAmount = (page: Page): Locator => page.getByTestId('debt-original-amount-label').first();
export const getDebtDeadline = (page: Page): Locator => page.getByTestId('debt-deadline-label').first();
export const getDebtLoggedCurrency = (page: Page): Locator => page.getByTestId('debt-logged-currency-label').first();
export const getDebtBaseCurrency = (page: Page): Locator => page.getByTestId('debt-base-currency-label').first();

// Other
export const getDebtDaysHeader = (page: Page): Locator =>
	page.locator('.table-header-row').filter({ hasText: 'Days' }).first();
