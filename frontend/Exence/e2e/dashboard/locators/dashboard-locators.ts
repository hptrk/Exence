import { Locator, Page } from '@playwright/test';

export const getDashboardTitle = (page: Page): Locator => page.getByTestId('dashboard-title');
export const getDashboardSubtitle = (page: Page): Locator => page.getByTestId('dashboard-subtitle');

// Summary containers (md+)
export const getSummaryIncome = (page: Page): Locator => page.getByTestId('summary-income');
export const getSummaryExpense = (page: Page): Locator => page.getByTestId('summary-expense');
export const getSummaryBalance = (page: Page): Locator => page.getByTestId('summary-balance');

// Transaction lists (lg layout — side by side)
export const getExpensesList = (page: Page): Locator => page.getByTestId('expenses-list');
export const getIncomeList = (page: Page): Locator => page.getByTestId('income-list');
// Transaction list (below-lg layout — single list)
export const getTransactionsList = (page: Page): Locator => page.getByTestId('transactions-list');

// Mobile create buttons (<lg)
export const getCreateExpenseBtn = (page: Page): Locator => page.getByTestId('create-expense-btn');
export const getCreateIncomeBtn = (page: Page): Locator => page.getByTestId('create-income-btn');

// Chart widget timeframe selector
export const getTimeframeSelector = (page: Page): Locator => page.getByTestId('timeframe');
export const getTimeframeChecked = (page: Page): Locator =>
	page.getByTestId('timeframe').locator('mat-button-toggle.mat-button-toggle-checked');
