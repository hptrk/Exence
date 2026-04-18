import { Locator, Page } from '@playwright/test';

export const getCreateTransactionDialog = (page: Page): Locator => page.getByTestId('create-transaction-dialog');
export const getTransactionTypeToggle = (page: Page): Locator => page.getByTestId('transaction-type-toggle');
export const getTransactionTypeToggleChecked = (page: Page): Locator =>
	page.getByTestId('transaction-type-toggle').locator('mat-button-toggle.mat-button-toggle-checked');
export const getTransactionTitleInput = (page: Page): Locator => page.getByTestId('transaction-title-input');
export const getTransactionAmountInput = (page: Page): Locator =>
	page.getByTestId('transaction-amount-stepper').locator('input[type="number"]');
export const getTransactionCategorySelect = (page: Page): Locator => page.getByTestId('transaction-category-select');
export const getTransactionCreateBtn = (page: Page): Locator => page.getByTestId('create-btn');
export const getTransactionDialogCloseBtn = (page: Page): Locator =>
	page.getByTestId('create-transaction-dialog').getByTestId('close-btn');
export const getTransactionRecurringCheckbox = (page: Page): Locator =>
	page.getByTestId('transaction-recurring-checkbox');
