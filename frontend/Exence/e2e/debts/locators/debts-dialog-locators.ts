import { Locator, Page } from '@playwright/test';

//  Create dialog

export const getCreateDebtDialog = (page: Page): Locator => page.getByTestId('create-debt-dialog');
export const getDebtTitleInput = (page: Page): Locator => page.getByTestId('debt-title-input');
export const getDebtCounterpartyInput = (page: Page): Locator => page.getByTestId('debt-counterparty-input');
export const getDebtOriginalAmountInput = (page: Page): Locator =>
	page.getByTestId('debt-original-amount-stepper').locator('input[type="number"]');
export const getDebtCurrencySelect = (page: Page): Locator => page.getByTestId('debt-currency-select');
export const getDebtTypeSelect = (page: Page): Locator => page.getByTestId('debt-type-select');
export const getDebtDeadlineInput = (page: Page): Locator => page.getByTestId('debt-deadline-input');
export const getDebtCategorySelect = (page: Page): Locator => page.getByTestId('debt-category-select');
export const getDebtCancelBtn = (page: Page): Locator => page.getByTestId('debt-cancel-btn');
export const getDebtCreateBtn = (page: Page): Locator => page.getByTestId('debt-create-btn');
export const getDebtCreateBtnInner = (page: Page): Locator => page.getByTestId('debt-create-btn').getByTestId('btn');
export const getDebtDialogCloseBtn = (page: Page): Locator =>
	page.getByTestId('create-debt-dialog').getByTestId('close-btn');

// Edit dialog
export const getEditDebtDialog = (page: Page): Locator => page.getByTestId('edit-debt-dialog');
export const getDebtStatusSelect = (page: Page): Locator => page.getByTestId('debt-status-select');
export const getDebtPaymentAmountInput = (page: Page): Locator =>
	page.getByTestId('debt-payment-amount-stepper').locator('input[type="number"]');
export const getDebtPayBtn = (page: Page): Locator => page.getByTestId('debt-pay-btn');
export const getDebtPayBtnInner = (page: Page): Locator => page.getByTestId('debt-pay-btn').getByTestId('btn');
export const getDebtSaveBtn = (page: Page): Locator => page.getByTestId('debt-save-btn');
export const getDebtSaveBtnInner = (page: Page): Locator => page.getByTestId('debt-save-btn').getByTestId('btn');
export const getEditDebtDialogCloseBtn = (page: Page): Locator =>
	page.getByTestId('edit-debt-dialog').getByTestId('close-btn');
export const getEditDebtCancelBtn = (page: Page): Locator =>
	page.getByTestId('edit-debt-dialog').getByTestId('debt-cancel-btn');

//  Confirm exit dialog

const confirmExitContainer = (page: Page): Locator =>
	page.locator('mat-dialog-container').filter({ hasText: 'Unsaved changes' });

export const getDebtConfirmExitDialog = (page: Page): Locator => confirmExitContainer(page);
export const getDebtConfirmExitContinueBtn = (page: Page): Locator =>
	confirmExitContainer(page).getByTestId('action-btn').filter({ hasText: 'Continue' });
export const getDebtConfirmExitCancelBtn = (page: Page): Locator =>
	confirmExitContainer(page).getByTestId('action-btn').filter({ hasText: 'Cancel' });

//  Misc dialog helpers

export const getFirstCategoryOption = (page: Page): Locator => page.locator('mat-option').first();
export const getDebtTypeOption = (page: Page, type: string): Locator =>
	page.getByRole('option').filter({ hasText: type });
export const getDebtStatusOption = (page: Page, status: string): Locator =>
	page.getByRole('option').filter({ hasText: status });
export const getDebtTitleClearBtn = (page: Page): Locator =>
	page.getByTestId('debt-title-input').locator('xpath=ancestor::mat-form-field').getByTestId('clear-btn');
export const getDebtCounterpartyClearBtn = (page: Page): Locator =>
	page.getByTestId('debt-counterparty-input').locator('xpath=ancestor::mat-form-field').getByTestId('clear-btn');
export const getDebtCategorySearchClearBtn = (page: Page): Locator =>
	page.locator('.search-with-select').getByTestId('clear-btn');
