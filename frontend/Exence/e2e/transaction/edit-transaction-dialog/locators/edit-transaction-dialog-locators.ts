import { Locator, Page } from '@playwright/test';

export const getEditTransactionDialog = (page: Page): Locator => page.getByTestId('edit-transaction-dialog');
export const getEditTypeToggle = (page: Page): Locator => page.getByTestId('edit-type-toggle');
export const getEditTypeToggleChecked = (page: Page): Locator =>
	page.getByTestId('edit-type-toggle').locator('mat-button-toggle.mat-button-toggle-checked');
export const getEditTitleInput = (page: Page): Locator => page.getByTestId('edit-title-input');
export const getEditAmountInput = (page: Page): Locator =>
	page.getByTestId('edit-transaction-dialog').locator('input[type="number"]').first();
export const getEditDateInput = (page: Page): Locator => page.getByTestId('edit-date-input');
export const getEditCurrencySelect = (page: Page): Locator => page.getByTestId('edit-currency-select');
export const getEditExchangeRateInput = (page: Page): Locator =>
	page.getByTestId('edit-exchange-rate-stepper').locator('input[type="number"]');
export const getEditCategorySelect = (page: Page): Locator => page.getByTestId('edit-category-select');
export const getEditCategorySearchInput = (page: Page): Locator => page.getByTestId('edit-category-search-input');
export const getEditSaveBtn = (page: Page): Locator => page.getByTestId('edit-save-btn');
export const getEditSaveBtnInner = (page: Page): Locator => page.getByTestId('edit-save-btn').getByTestId('btn');
export const getEditDialogCloseBtn = (page: Page): Locator =>
	page.getByTestId('edit-transaction-dialog').getByTestId('close-btn');

const confirmExitDialogContainer = (page: Page): Locator =>
	page.locator('mat-dialog-container').filter({ hasText: 'Unsaved changes' });
export const getEditConfirmExitDialog = (page: Page): Locator => confirmExitDialogContainer(page);
export const getEditConfirmExitContinueBtn = (page: Page): Locator =>
	confirmExitDialogContainer(page).getByTestId('action-btn').filter({ hasText: 'Continue' });
export const getEditConfirmExitCancelBtn = (page: Page): Locator =>
	confirmExitDialogContainer(page).getByTestId('action-btn').filter({ hasText: 'Cancel' });
