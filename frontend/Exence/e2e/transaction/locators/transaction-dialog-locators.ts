import { Locator, Page } from '@playwright/test';

export const getCreateTransactionDialog = (page: Page): Locator => page.getByTestId('create-transaction-dialog');
export const getTransactionTypeToggle = (page: Page): Locator => page.getByTestId('transaction-type-toggle');
export const getTransactionTypeToggleChecked = (page: Page): Locator =>
	page.getByTestId('transaction-type-toggle').locator('mat-button-toggle.mat-button-toggle-checked');
export const getTransactionTitleInput = (page: Page): Locator => page.getByTestId('transaction-title-input');
export const getTransactionAmountInput = (page: Page): Locator =>
	page.getByTestId('transaction-amount-stepper').locator('input[type="number"]');
export const getTransactionCategorySelect = (page: Page): Locator => page.getByTestId('transaction-category-select');
export const getTransactionCurrencySelect = (page: Page): Locator => page.getByTestId('transaction-currency-select');
export const getTransactionCurrencyOption = (page: Page, currency: string): Locator =>
	page.getByRole('option').filter({ hasText: currency });
export const getTransactionDateInput = (page: Page): Locator => page.getByTestId('transaction-date-input');
export const getTransactionCreateBtn = (page: Page): Locator => page.getByTestId('create-btn');
export const getTransactionCreateBtnInner = (page: Page): Locator => page.getByTestId('create-btn').getByTestId('btn');
export const getTransactionDialogCloseBtn = (page: Page): Locator =>
	page.getByTestId('create-transaction-dialog').getByTestId('close-btn');
export const getFirstMatOption = (page: Page): Locator => page.locator('mat-option').first();
export const getTransactionCategoryOption = (page: Page, name: string): Locator =>
	page.locator('mat-option').filter({ hasText: name });
export const getTransactionRecurringCheckbox = (page: Page): Locator =>
	page.getByTestId('transaction-recurring-checkbox');
export const getTransactionRecurringCheckboxInput = (page: Page): Locator =>
	getTransactionRecurringCheckbox(page).locator('input[type="checkbox"]');
export const getRecurringConfig = (page: Page): Locator => page.getByTestId('recurring-config');
