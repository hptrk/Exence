import { Locator, Page } from '@playwright/test';

//  Create dialog

export const getCreateGoalDialog = (page: Page): Locator => page.getByTestId('create-goal-dialog');
export const getGoalTitleInput = (page: Page): Locator => page.getByTestId('goal-title-input');
export const getGoalTargetAmountInput = (page: Page): Locator =>
	page.getByTestId('goal-target-amount-stepper').locator('input[type="number"]');
export const getGoalInitialAmountInput = (page: Page): Locator =>
	page.getByTestId('goal-initial-amount-stepper').locator('input[type="number"]');
export const getGoalCurrencySelect = (page: Page): Locator => page.getByTestId('goal-currency-select');
export const getGoalDeadlineInput = (page: Page): Locator => page.getByTestId('goal-deadline-input');
export const getGoalCategorySelect = (page: Page): Locator => page.getByTestId('goal-category-select');
export const getGoalDescriptionInput = (page: Page): Locator => page.getByTestId('goal-description-input');
export const getGoalCreateBtn = (page: Page): Locator => page.getByTestId('goal-create-btn');
export const getGoalCreateBtnInner = (page: Page): Locator => page.getByTestId('goal-create-btn').getByTestId('btn');
export const getGoalCancelBtn = (page: Page): Locator => page.getByTestId('goal-cancel-btn');
export const getGoalDialogCloseBtn = (page: Page): Locator =>
	page.getByTestId('create-goal-dialog').getByTestId('close-btn');

//  Edit dialog

export const getEditGoalDialog = (page: Page): Locator => page.getByTestId('edit-goal-dialog');
export const getGoalCurrentAmountInput = (page: Page): Locator =>
	page.getByTestId('goal-current-amount-stepper').locator('input[type="number"]');
export const getGoalStatusSelect = (page: Page): Locator => page.getByTestId('goal-status-select');
export const getGoalSaveBtn = (page: Page): Locator => page.getByTestId('goal-save-btn');
export const getGoalSaveBtnInner = (page: Page): Locator => page.getByTestId('goal-save-btn').getByTestId('btn');
export const getEditGoalDialogCloseBtn = (page: Page): Locator =>
	page.getByTestId('edit-goal-dialog').getByTestId('close-btn');
export const getEditGoalCancelBtn = (page: Page): Locator =>
	page.getByTestId('edit-goal-dialog').getByTestId('goal-cancel-btn');

//  Confirm exit dialog

const confirmExitContainer = (page: Page): Locator =>
	page.locator('mat-dialog-container').filter({ hasText: 'Unsaved changes' });

export const getGoalConfirmExitDialog = (page: Page): Locator => confirmExitContainer(page);
export const getGoalConfirmExitContinueBtn = (page: Page): Locator =>
	confirmExitContainer(page).getByTestId('action-btn').filter({ hasText: 'Continue' });
export const getGoalConfirmExitCancelBtn = (page: Page): Locator =>
	confirmExitContainer(page).getByTestId('action-btn').filter({ hasText: 'Cancel' });

//  Misc dialog helpers

export const getFirstCategoryOption = (page: Page): Locator => page.locator('mat-option').first();
export const getStatusOption = (page: Page, status: string): Locator =>
	page.getByRole('option').filter({ hasText: status });
export const getGoalTitleClearBtn = (page: Page): Locator =>
	page.getByTestId('goal-title-input').locator('xpath=ancestor::mat-form-field').getByTestId('clear-btn');
export const getGoalDescriptionClearBtn = (page: Page): Locator =>
	page.getByTestId('goal-description-input').locator('xpath=ancestor::mat-form-field').getByTestId('clear-btn');
export const getCategorySearchClearBtn = (page: Page): Locator =>
	page.locator('.search-with-select').getByTestId('clear-btn');
export const getCalendar = (page: Page): Locator => page.locator('mat-calendar');
export const getCalendarDisabledCells = (page: Page): Locator =>
	page.locator('.mat-calendar-body-cell[aria-disabled="true"]');
export const getCalendarEnabledCells = (page: Page): Locator =>
	page.locator('.mat-calendar-body-cell:not([aria-disabled="true"])');
