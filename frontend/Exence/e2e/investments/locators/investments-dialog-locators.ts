import { Locator, Page } from '@playwright/test';

// Create dialog
// Used for both "Add New Asset" and "Add Purchase" — distinguished by dialog title
export const getCreateInvestmentDialog = (page: Page): Locator => page.getByTestId('create-investment-dialog');
// The title is rendered in [ex-dialog-card-title] — check its textContent to distinguish dialogs
export const getCreateInvestmentDialogTitle = (page: Page): Locator =>
	page.getByTestId('create-investment-dialog').locator('[ex-dialog-card-title]');
export const getInvestmentAssetInput = (page: Page): Locator => page.getByTestId('investment-asset-input');
export const getInvestmentAssetAutocompleteOptions = (page: Page): Locator =>
	page.getByTestId('investment-asset-input-autocomplete-option');
export const getInvestmentPurchaseDateInput = (page: Page): Locator =>
	page.getByTestId('investment-purchase-date-input');
export const getInvestmentTypeSelect = (page: Page): Locator => page.getByTestId('investment-type-select');
export const getInvestmentAmountInput = (page: Page): Locator =>
	page.getByTestId('investment-amount-stepper').locator('input[type="number"]');
export const getInvestmentCurrencySelect = (page: Page): Locator => page.getByTestId('investment-currency-select');
export const getInvestmentNoteInput = (page: Page): Locator => page.getByTestId('investment-note-input');
export const getInvestmentCancelBtn = (page: Page): Locator => page.getByTestId('investment-cancel-btn');
export const getInvestmentCreateBtn = (page: Page): Locator => page.getByTestId('investment-create-btn');
export const getInvestmentCreateBtnInner = (page: Page): Locator =>
	page.getByTestId('investment-create-btn').getByTestId('btn');
export const getCreateInvestmentDialogCloseBtn = (page: Page): Locator =>
	page.getByTestId('create-investment-dialog').getByTestId('close-btn');

// Edit investment dialog (opens from purchase row edit button in expanded detail)
export const getEditInvestmentDialog = (page: Page): Locator => page.getByTestId('edit-investment-dialog');
export const getInvestmentSaveBtn = (page: Page): Locator => page.getByTestId('investment-save-btn');
export const getInvestmentSaveBtnInner = (page: Page): Locator =>
	page.getByTestId('investment-save-btn').getByTestId('btn');
export const getEditInvestmentDialogCloseBtn = (page: Page): Locator =>
	page.getByTestId('edit-investment-dialog').getByTestId('close-btn');
export const getEditInvestmentCancelBtn = (page: Page): Locator =>
	page.getByTestId('edit-investment-dialog').getByTestId('investment-cancel-btn');

// Confirm exit dialog (shared component — triggered when closing dialog with dirty form)
const confirmExitContainer = (page: Page): Locator =>
	page.locator('mat-dialog-container').filter({ hasText: 'Unsaved changes' });

export const getInvestmentConfirmExitDialog = (page: Page): Locator => confirmExitContainer(page);
export const getInvestmentConfirmExitContinueBtn = (page: Page): Locator =>
	confirmExitContainer(page).getByTestId('action-btn').filter({ hasText: 'Continue' });
export const getInvestmentConfirmExitCancelBtn = (page: Page): Locator =>
	confirmExitContainer(page).getByTestId('action-btn').filter({ hasText: 'Cancel' });

// Misc dialog helpers
export const getCalendar = (page: Page): Locator => page.locator('mat-calendar');
export const getInvestmentTypeOption = (page: Page, type: string): Locator =>
	page.getByRole('option').filter({ hasText: type });
export const getFirstAssetOption = (page: Page): Locator => page.locator('mat-option').first();
export const getInvestmentAssetClearBtn = (page: Page): Locator =>
	page.getByTestId('investment-asset-input').locator('xpath=ancestor::mat-form-field').getByTestId('clear-btn');
export const getInvestmentNoteClearBtn = (page: Page): Locator =>
	page.getByTestId('investment-note-input').locator('xpath=ancestor::mat-form-field').getByTestId('clear-btn');
